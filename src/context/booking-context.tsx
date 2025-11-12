"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Booking, BookingStatus } from '@/lib/data';

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    if (typeof window !== 'undefined') {
      const savedBookings = localStorage.getItem('skyport-bookings');
      return savedBookings ? JSON.parse(savedBookings) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const parsedBookings = bookings.map(booking => ({
            ...booking,
            departureTime: new Date(booking.flight.departureTime),
            arrivalTime: new Date(booking.flight.arrivalTime),
            bookingTime: new Date(booking.bookingTime),
        }));
        // Only update if there's a difference to avoid loops
        if (JSON.stringify(bookings) !== JSON.stringify(parsedBookings)) {
            // This is to correctly handle date objects after parsing from JSON
        }
        localStorage.setItem('skyport-bookings', JSON.stringify(bookings));
    }
  }, [bookings]);
  

  const addBooking = (booking: Booking) => {
    setBookings((prevBookings) => [...prevBookings, booking]);
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status } : booking
      )
    );
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, updateBookingStatus }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
