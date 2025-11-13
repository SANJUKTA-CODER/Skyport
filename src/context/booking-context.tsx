
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Booking, BookingStatus, Flight, Seat, Passenger } from '@/lib/data';

interface BookingContextType {
  bookings: Booking[];
  addBooking: (bookingDetails: { flight: Flight; passenger: Passenger; seatNumber: string; bookingId: string; status: BookingStatus; }) => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Helper function to rehydrate dates from JSON strings
const rehydrateBooking = (booking: any): Booking => ({
    ...booking,
    flight: {
        ...booking.flight,
        departureTime: new Date(booking.flight.departureTime),
        arrivalTime: new Date(booking.flight.arrivalTime),
    },
    bookingTime: new Date(booking.bookingTime),
});

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    if (typeof window !== 'undefined') {
      const savedBookings = localStorage.getItem('skyport-bookings');
      return savedBookings ? JSON.parse(savedBookings).map(rehydrateBooking) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('skyport-bookings', JSON.stringify(bookings));
    }
  }, [bookings]);
  

  const addBooking = (bookingDetails: { flight: Flight; passenger: Passenger; seatNumber: string; bookingId: string; status: BookingStatus; }) => {
    const { flight, passenger, seatNumber, bookingId, status } = bookingDetails;
    
    const seat = flight.seats.find(s => s.number === seatNumber);
    if (!seat) {
        console.error(`Seat ${seatNumber} not found for flight ${flight.id}`);
        return;
    }

    const newBooking: Booking = {
        id: bookingId,
        flight,
        passengerName: passenger.name,
        passengerEmail: passenger.email,
        seat,
        bookingTime: new Date(),
        status,
    };

    setBookings((prevBookings) => [...prevBookings, newBooking]);
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id.startsWith(bookingId.split('-')[0]) ? { ...booking, status } : booking
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
