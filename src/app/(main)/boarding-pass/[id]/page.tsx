"use client";

import { useBooking } from "@/context/booking-context";
import { BoardingPass } from "@/components/boarding-pass";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function BoardingPassPage() {
    const { id } = useParams();
    const { bookings } = useBooking();
    const router = useRouter();

    // The booking data might have string dates, so we parse them.
    const booking = bookings.find(b => b.id === id);

    if (!booking) {
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
            <div className="container mx-auto max-w-lg">
                <BoardingPass booking={booking} />
            </div>
        </div>
    );
}
