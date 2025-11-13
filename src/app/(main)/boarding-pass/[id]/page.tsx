
"use client";

import { useBooking } from "@/context/booking-context";
import { BoardingPass } from "@/components/boarding-pass";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { Booking } from "@/lib/data";

export default function BoardingPassPage() {
    const { id } = useParams();
    const { bookings } = useBooking();
    const router = useRouter();
    const [currentBookings, setCurrentBookings] = useState<Booking[]>([]);
    
    useEffect(() => {
        const bookingIdPrefix = Array.isArray(id) ? id[0].split('-')[0] : id.split('-')[0];
        const relatedBookings = bookings.filter(b => b.id.startsWith(bookingIdPrefix));
        
        if (relatedBookings.length > 0) {
            setCurrentBookings(relatedBookings);
        } else {
            // Fallback for direct navigation or refresh
            const storedFlight = localStorage.getItem('currentFlight');
            if (storedFlight) {
                // This is a simplified reconstruction for display.
                // In a real app, you'd fetch the complete booking details from a server.
                const parsedFlight = JSON.parse(storedFlight);
                const mockBooking = {
                    id: bookingIdPrefix,
                    flight: {
                        ...parsedFlight,
                        from: { name: parsedFlight.fromCity, code: parsedFlight.fromCode },
                        to: { name: parsedFlight.toCity, code: parsedFlight.toCode },
                        airline: { name: parsedFlight.airline, logoUrl: parsedFlight.airlineLogoUrl },
                        departureTime: new Date(parsedFlight.departureTime),
                        arrivalTime: new Date(parsedFlight.arrivalTime),
                    },
                    passengerName: 'Passenger', // Placeholder
                    passengerEmail: 'passenger@email.com', // Placeholder
                    seat: { id: 'N/A', number: 'N/A', isAvailable: false },
                    bookingTime: new Date(),
                    status: 'upcoming' as const,
                };
                setCurrentBookings([mockBooking]);
            }
        }
    }, [id, bookings]);

    if (currentBookings.length === 0) {
        return (
            <div className="container mx-auto max-w-2xl py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
                <p className="text-muted-foreground mb-6">We couldn't find the booking you're looking for. It might have been cancelled or the link is incorrect.</p>
                <Button onClick={() => router.push('/my-bookings')}>View My Bookings</Button>
            </div>
        );
    }
    
    return (
        <div className="py-12 gradient-sky">
            <div className="container mx-auto max-w-lg space-y-8">
                {currentBookings.map(b => (
                    <BoardingPass key={b.id} booking={b} />
                ))}
            </div>
        </div>
    );
}
