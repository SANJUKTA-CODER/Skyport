
"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import { Flight } from "@/lib/data";
import { BookingForm } from "@/components/booking-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, Clock, Users, Plane as PlaneIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useBooking } from '@/context/booking-context';

type SelectedFlight = {
    flightId: string;
    fromCity: string;
    toCity: string;
    journeyDate: string;
    airline: string;
    passengers: string;
    fare: number;
    departureTime: string;
    arrivalTime: string;
};

function BookingPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const flightId = searchParams.get('flightId');
    const { getFlightById } = useBooking();
    const [selectedFlight, setSelectedFlight] = useState<SelectedFlight | null>(null);
    const [flight, setFlight] = useState<Flight | undefined>(undefined);
    
    useEffect(() => {
        const storedFlight = localStorage.getItem('currentFlight');
        if (storedFlight) {
            const parsedFlight = JSON.parse(storedFlight);
            if (parsedFlight.flightId === flightId) {
                setSelectedFlight(parsedFlight);
                const flightData = getFlightById(flightId || '');
                if (flightData) {
                    flightData.departureTime = new Date(parsedFlight.departureTime);
                    flightData.arrivalTime = new Date(parsedFlight.arrivalTime);
                    setFlight(flightData);
                }
            }
        }
        if (!flight) {
            const flightData = getFlightById(flightId || '');
            setFlight(flightData);
        }

    }, [flightId, getFlightById, flight]);


    if (!flight || !selectedFlight) {
        return (
            <div className="container mx-auto text-center py-16">
                <p className="text-lg text-muted-foreground">No flight selected or booking details are incomplete.</p>
                <button onClick={() => router.push('/home')} className="mt-4">Search Again</button>
            </div>
        )
    }

    const formatTime = (time: string) => format(new Date(time), 'HH:mm');
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
                            <CardDescription>{selectedFlight.airline}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">{selectedFlight.fromCity}</span>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold">{selectedFlight.toCity}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>{formatDate(selectedFlight.journeyDate)}</span>
                            </div>
                             <div className="flex items-center text-muted-foreground">
                                <Users className="mr-2 h-4 w-4" />
                                <span>{selectedFlight.passengers} Passenger(s)</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Clock className="mr-2 h-4 w-4" />
                                <span>{formatTime(selectedFlight.departureTime)} - {formatTime(selectedFlight.arrivalTime)}</span>
                            </div>
                            <div className="border-t pt-4 mt-4 flex justify-between items-center">
                                <span className="font-semibold">Total Price</span>
                                <span className="text-xl font-bold text-primary">₹{(selectedFlight.fare * parseInt(selectedFlight.passengers)).toLocaleString('en-IN')}</span>
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
