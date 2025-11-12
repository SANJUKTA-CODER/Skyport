"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useBooking } from "@/context/booking-context";
import { ALL_FLIGHTS, Flight } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowRight, CreditCard, Banknote, Wallet, Terminal, CheckCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog"
import { Input } from "./ui/input";

export function PaymentForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addBooking } = useBooking();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [upiId, setUpiId] = useState('');
    const [isUpiValid, setIsUpiValid] = useState(true);

    const flightId = searchParams.get('flightId');
    const passengerName = searchParams.get('passengerName');
    const passengerEmail = searchParams.get('passengerEmail');
    const selectedSeatId = searchParams.get('selectedSeat');

    const flight: Flight | undefined = ALL_FLIGHTS.find(f => f.id === flightId);

    if (!flight || !passengerName || !passengerEmail || !selectedSeatId) {
        return (
             <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                   There was a problem loading your booking details. Please try again.
                   <Button variant="link" onClick={() => router.push('/home')}>Start Over</Button>
                </AlertDescription>
            </Alert>
        )
    }

    const seat = flight.seats.find(s => s.id === selectedSeatId);
    if (!seat) {
         return (
             <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Seat not available</AlertTitle>
                <AlertDescription>
                   The selected seat is no longer available.
                   <Button variant="link" onClick={() => router.back()}>Go Back</Button>
                </AlertDescription>
            </Alert>
        )
    }

    const validateUpi = () => {
        const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
        const isValid = upiRegex.test(upiId);
        setIsUpiValid(isValid);
        return isValid;
    }

    const handlePayment = () => {
        if (paymentMethod === 'upi' && !validateUpi()) {
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            const bookingId = `BK${Date.now()}`;
            addBooking({
                id: bookingId,
                flight,
                passengerName,
                passengerEmail,
                seat,
                bookingTime: new Date(),
                status: 'upcoming',
            });
            setIsLoading(false);
            setPaymentSuccess(true);

            setTimeout(() => {
                router.push(`/boarding-pass/${bookingId}`);
            }, 2000);
        }, 2000);
    }

    const formatTime = (date: Date) => format(date, 'HH:mm');
    const formatDate = (date: Date) => format(date, 'EEEE, MMM d');

    return (
        <>
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Choose Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant={paymentMethod === 'card' ? 'default' : 'outline'} className="w-full justify-start h-14 text-base" onClick={() => setPaymentMethod('card')}><CreditCard className="mr-4"/> Credit / Debit Card</Button>
                        <Button variant={paymentMethod === 'upi' ? 'default' : 'outline'} className="w-full justify-start h-14 text-base" onClick={() => setPaymentMethod('upi')}><Banknote className="mr-4"/> UPI</Button>
                        <Button variant={paymentMethod === 'netbanking' ? 'default' : 'outline'} className="w-full justify-start h-14 text-base" onClick={() => setPaymentMethod('netbanking')}><Wallet className="mr-4"/> Net Banking</Button>
                        
                        {paymentMethod === 'card' && (
                            <Card className="p-4 mt-4">
                                <div className="space-y-4">
                                    <Input placeholder="Card Number" />
                                    <div className="flex gap-4">
                                        <Input placeholder="MM/YY" />
                                        <Input placeholder="CVV" />
                                    </div>
                                </div>
                            </Card>
                        )}

                        {paymentMethod === 'upi' && (
                            <Card className="p-4 mt-4">
                                <div className="space-y-2">
                                    <Input 
                                        placeholder="your-id@upi" 
                                        value={upiId}
                                        onChange={(e) => {
                                            setUpiId(e.target.value);
                                            if (!isUpiValid) setIsUpiValid(true);
                                        }}
                                        className={!isUpiValid ? 'border-destructive' : ''}
                                    />
                                    {!isUpiValid && <p className="text-destructive text-xs">Please enter a valid UPI ID (e.g., name@upi).</p>}
                                </div>
                            </Card>
                        )}
                         {paymentMethod === 'netbanking' && (
                            <Card className="p-4 mt-4">
                                <p className="text-muted-foreground text-center">Net Banking is currently unavailable. Please choose another payment method.</p>
                            </Card>
                        )}
                    </CardContent>
                </Card>
            </div>
             <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Booking Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex items-center justify-between font-semibold">
                            <span>{flight.from.name}</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <span>{flight.to.name}</span>
                        </div>
                        <p className="text-muted-foreground">{formatDate(flight.departureTime)} at {formatTime(flight.departureTime)}</p>
                        <p className="text-muted-foreground">{passengerName}</p>
                        <p className="text-muted-foreground">Seat {seat.number}</p>
                        <div className="border-t pt-4 mt-4 flex justify-between items-center">
                            <span className="font-semibold text-lg">Total Payable</span>
                            <span className="text-2xl font-bold text-primary">₹{flight.price.toLocaleString('en-IN')}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        <div className="mt-8 text-center">
            <Button onClick={handlePayment} disabled={isLoading || paymentMethod === 'netbanking'} size="lg" className="w-full md:w-1/2 bg-accent hover:bg-accent/90 btn-glow">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Processing...' : `Pay ₹${flight.price.toLocaleString('en-IN')} Securely`}
            </Button>
        </div>

        <AlertDialog open={paymentSuccess}>
            <AlertDialogContent className="max-w-md text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold mt-4">✅ Payment Successful!</h3>
                <p className="text-muted-foreground mt-2">Your ticket is ready! Redirecting you to your boarding pass...</p>
            </AlertDialogContent>
        </AlertDialog>
        </>
    )
}
