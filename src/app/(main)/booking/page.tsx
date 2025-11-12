
"use client";

import { Suspense } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import { ALL_FLIGHTS, Flight } from "@/lib/data";
import { BookingForm } from "@/components/booking-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';

function BookingPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const flightId = searchParams.get('flightId');
    const flight: Flight | undefined = ALL_FLIGHTS.find(f => f.id === flightId);
    const date = searchParams.get('date');
    const passengersCount = searchParams.get('passengers') || '1';

    if (!flight || !date) {
        return (
            <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">Flight not found or booking details are incomplete.</p>
                <button onClick={() => router.push('/')} className="mt-4">Search Again</button>
            </div>
        )
    }

    const formatTime = (time: Date) => format(time, 'HH:mm');
    const formatDate = (dateString: string) => format(new Date(dateString), 'EEEE, MMM d');

    return (
        <div className="container mx-auto max-w-4xl py-12 px-4">
            <h1 className="text-3xl font-bold mb-8 font-headline">Complete Your Booking</h1>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <BookingForm flight={flight} />
                </div>
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Flight Summary</CardTitle>
                            <CardDescription>{flight.airline.name}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">{flight.from.name}</span>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold">{flight.to.name}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>{formatDate(date)}</span>
                            </div>
                             <div className="flex items-center text-muted-foreground">
                                <Users className="mr-2 h-4 w-4" />
                                <span>{passengersCount} Passenger(s)</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Clock className="mr-2 h-4 w-4" />
                                <span>{formatTime(flight.departureTime)} - {formatTime(flight.arrivalTime)}</span>
                            </div>
                            <div className="border-t pt-4 mt-4 flex justify-between items-center">
                                <span className="font-semibold">Total Price</span>
                                <span className="text-xl font-bold text-primary">₹{(flight.price * parseInt(passengersCount)).toLocaleString('en-IN')}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function BookingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookingPageContent />
        </Suspense>
    );
}

    