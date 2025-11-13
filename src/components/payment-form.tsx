

"use client";

import { useRouter } from "next/navigation";
import { useBooking } from "@/context/booking-context";
import { Flight, Seat } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowRight, CreditCard, Banknote, Wallet, Terminal, CheckCircle, Loader2, User, Landmark } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog"
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";

type PassengerData = {
    name: string;
    email: string;
};

type BookingData = {
    flight: Flight;
    passengers: PassengerData[];
    selectedSeats: string[];
    date: string;
};

// Simple SVGs for card logos
const VisaIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.1 7.9c-.3-1.6-.9-3.2-1.9-4.5-.3-.4-.8-.6-1.3-.6H5.1c-.5 0-1 .2-1.3.6C2.8 4.7 2.2 6.3 1.9 7.9c-.2 1.3-.2 2.8 0 4.2.3 1.6.9 3.2 1.9 4.5.3.4.8.6 1.3.6h13.7c.5 0 1-.2 1.3-.6 1-1.3 1.6-2.9 1.9-4.5.2-1.4.2-2.9 0-4.2z"/><path d="M2 12h20"/><path d="M12.2 14.8c.4.4.8.7 1.3.7s.9-.3 1.3-.7c.7-1.1.7-2.6 0-3.6-.4-.4-.8-.7-1.3-.7s-.9.3-1.3.7c-.8 1-.8 2.6 0 3.6z"/><path d="M8.2 14.8c.4.4.8.7 1.3.7s.9-.3 1.3-.7c.8-1.1.8-2.6 0-3.6-.4-.4-.8-.7-1.3-.7s-.9.3-1.3.7c-.7 1-.7 2.6 0 3.6z"/></svg>
);
const MasterCardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
);
const RuPayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h8"/><path d="M12 8v8"/><path d="M12 18.23A6.24 6.24 0 0 1 5.77 12 6.24 6.24 0 0 1 12 5.77 6.24 6.24 0 0 1 18.23 12 6.24 6.24 0 0 1 12 18.23z"/><path d="M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10z"/></svg>
);


const indianBanks = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Bank of Baroda"];

export function PaymentForm() {
    const router = useRouter();
    const { addBooking } = useBooking();
    const { toast } = useToast();

    const [bookingData, setBookingData] = useState<BookingData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    
    // Card State
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    
    // UPI State
    const [upiId, setUpiId] = useState('');
    const [isUpiValid, setIsUpiValid] = useState(true);

    // Net Banking State
    const [selectedBank, setSelectedBank] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const data = sessionStorage.getItem('skyport-booking-data');
            if (data) {
                const parsedData = JSON.parse(data);
                parsedData.flight.departureTime = new Date(parsedData.flight.departureTime);
                parsedData.flight.arrivalTime = new Date(parsedData.flight.arrivalTime);
                setBookingData(parsedData);
            }
        }
    }, []);

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\s/g, '');
        if (rawValue.length <= 16) {
            const formatted = rawValue.match(/.{1,4}/g)?.join(' ') || '';
            setCardNumber(formatted);
        }
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\//g, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        if (value.length <= 5) {
            setExpiry(value);
        }
    };


    const validateCardDetails = () => {
        const isCardNumberValid = cardNumber.replace(/\s/g, '').length === 16;
        const isExpiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
        const isCvvValid = /^\d{3}$/.test(cvv);
        const isCardNameValid = cardName.trim().length > 2;

        if (!isCardNumberValid || !isExpiryValid || !isCvvValid || !isCardNameValid) {
            toast({
                variant: "destructive",
                title: "Invalid Card Details",
                description: "Please enter valid card details to proceed.",
            });
            return false;
        }
        return true;
    }

    const validateUpi = () => {
        const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
        const isValid = upiRegex.test(upiId);
        setIsUpiValid(isValid);
        if (!isValid) {
            toast({ variant: "destructive", title: "Invalid UPI ID" });
        }
        return isValid;
    }

    const validateNetBanking = () => {
        if (!selectedBank) {
            toast({ variant: "destructive", title: "Select a Bank", description: "Please select your bank from the list." });
            return false;
        }
        return true;
    }

    const handlePayment = () => {
        if (paymentMethod === 'card' && !validateCardDetails()) return;
        if (paymentMethod === 'upi' && !validateUpi()) return;
        if (paymentMethod === 'netbanking' && !validateNetBanking()) return;
        

        setIsLoading(true);
        setTimeout(() => {
            if (!bookingData) return;

            const bookingId = `BK${Date.now()}`;
            const { flight, passengers, selectedSeats } = bookingData;
            
            if (passengers.length > 0) {
              passengers.forEach((passenger, index) => {
                  addBooking({
                      flight,
                      passenger: { ...passenger, age: 0, gender: '', phone: ''},
                      seatNumber: selectedSeats[index],
                      bookingId: `${bookingId}-${index}`,
                      status: 'upcoming'
                  });
              });
            }
           
            setIsLoading(false);
            setPaymentSuccess(true);
            
            if (typeof window !== 'undefined') {
                sessionStorage.removeItem('skyport-booking-data');
            }

            setTimeout(() => {
                router.push(`/boarding-pass/${bookingId}-0`);
            }, 2000);
        }, 2000);
    }
    
    if (!bookingData) {
        return (
             <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                   No flight selected. Please try again.
                   <Button variant="link" onClick={() => router.push('/home')}>Start Over</Button>
                </AlertDescription>
            </Alert>
        )
    }
    
    const { flight, passengers, selectedSeats, date } = bookingData;
    const totalPrice = flight.price * (passengers.length || 1);
    const formatDate = (dateString: string) => format(new Date(dateString), 'EEEE, MMM d');

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
                            <Card className="p-6 mt-4">
                                <div className="flex justify-end gap-2 mb-4">
                                    <VisaIcon />
                                    <MasterCardIcon />
                                    <RuPayIcon />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="card-number">Card Number</Label>
                                        <Input id="card-number" placeholder="#### #### #### ####" value={cardNumber} onChange={handleCardNumberChange} />
                                    </div>
                                    <div>
                                        <Label htmlFor="card-name">Card Holder Name</Label>
                                        <Input id="card-name" placeholder="John Doe" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <Label htmlFor="expiry">Expiry Date</Label>
                                            <Input id="expiry" placeholder="MM/YY" value={expiry} onChange={handleExpiryChange} />
                                        </div>
                                        <div className="flex-1">
                                            <Label htmlFor="cvv">CVV</Label>
                                            <Input id="cvv" placeholder="123" value={cvv} onChange={(e) => /^\d{0,3}$/.test(e.target.value) && setCvv(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {paymentMethod === 'upi' && (
                            <Card className="p-6 mt-4">
                                <Label htmlFor="upi-id">Enter UPI ID</Label>
                                <Input 
                                    id="upi-id"
                                    placeholder="your-id@upi" 
                                    value={upiId}
                                    onChange={(e) => {
                                        setUpiId(e.target.value);
                                        if (!isUpiValid) setIsUpiValid(true);
                                    }}
                                    className={!isUpiValid ? 'border-destructive' : ''}
                                />
                                {!isUpiValid && <p className="text-destructive text-xs mt-1">Please enter a valid UPI ID.</p>}
                            </Card>
                        )}

                         {paymentMethod === 'netbanking' && (
                            <Card className="p-6 mt-4">
                                 <Label htmlFor="bank-select">Select Your Bank</Label>
                                <Select onValueChange={setSelectedBank} value={selectedBank}>
                                    <SelectTrigger id="bank-select">
                                        <SelectValue placeholder="Choose a bank" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {indianBanks.map(bank => (
                                            <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Card>
                        )}
                    </CardContent>
                </Card>
            </div>
             <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Booking Summary</CardTitle>
                        <CardDescription>{flight.airline.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex items-center justify-between font-semibold">
                            <span>{flight.from.name}</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <span>{flight.to.name}</span>
                        </div>
                        <p className="text-muted-foreground">{formatDate(date)}</p>
                        
                        <div className="border-t pt-4 mt-4">
                            <h3 className="font-semibold mb-2 flex items-center"><User className="mr-2 h-4 w-4"/>Passengers ({passengers.length || 1})</h3>
                            {passengers.length > 0 ? passengers.map((p, i) => (
                                <div key={i} className="text-muted-foreground flex justify-between">
                                    <span>{p.name}</span>
                                    <span className="font-mono">{selectedSeats[i]}</span>
                                </div>
                            )) : (
                                <div className="text-muted-foreground flex justify-between">
                                    <span>Passenger 1</span>
                                    <span className="font-mono">{selectedSeats[0]}</span>
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-4 mt-4 flex justify-between items-center">
                            <span className="font-semibold text-lg">Total Payable</span>
                            <span className="text-2xl font-bold text-primary">₹{totalPrice.toLocaleString('en-IN')}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        <div className="mt-8 text-center">
            <Button onClick={handlePayment} disabled={isLoading} size="lg" className="w-full md:w-1/2 bg-accent hover:bg-accent/90 btn-glow">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Processing...' :
                 paymentMethod === 'netbanking' ? 'Proceed to Bank Gateway' :
                 `Pay Securely ₹${totalPrice.toLocaleString('en-IN')}`}
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

    