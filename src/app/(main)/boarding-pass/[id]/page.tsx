
"use client";

import { useBooking } from "@/context/booking-context";
import { BoardingPass } from "@/components/boarding-pass";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function BoardingPassPage() {
    const { id } = useParams();
    const { bookings } = useBooking();
    const router = useRouter();
    
    const bookingIdPrefix = Array.isArray(id) ? id[0].split('-')[0] : id.split('-')[0];
    const booking = bookings.find(b => b.id.startsWith(bookingIdPrefix));

    if (!booking) {
        return (
            <div className="container mx-auto max-w-2xl py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
                <p className="text-muted-foreground mb-6">We couldn't find the booking you're looking for. It might have been cancelled or the link is incorrect.</p>
                <Button onClick={() => router.push('/my-bookings')}>View My Bookings</Button>
            </div>
        );
    }
    
    // Find all passengers for this booking
    const relatedBookings = bookings.filter(b => b.id.startsWith(bookingIdPrefix));
    
    return (
        <div className="py-12 gradient-sky">
            <div className="container mx-auto max-w-lg space-y-8">
                {relatedBookings.map(b => (
                    <BoardingPass key={b.id} booking={b} />
                ))}
            </div>
        </div>
    );
}

    