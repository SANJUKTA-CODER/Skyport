"use client";

import React, { useState } from 'react';
import { useBooking } from "@/context/booking-context";
import type { Booking, BookingStatus } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import { ArrowRight, Calendar, Clock, Plane } from "lucide-react";
import Link from 'next/link';
import { cn } from "@/lib/utils";

function BookingCard({ booking }: { booking: Booking }) {
    const { updateBookingStatus } = useBooking();
    const { flight, status } = booking;
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

    const formatTime = (date: Date) => format(new Date(date), 'HH:mm');
    const formatDate = (date: Date) => format(new Date(date), 'MMM d, yyyy');

    const statusStyles: Record<BookingStatus, string> = {
        upcoming: 'bg-blue-500 border-blue-500 text-white',
        completed: 'bg-green-500 border-green-500 text-white',
        cancelled: 'bg-red-500 border-red-500 text-white',
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <span>{flight.from.name}</span>
                                <ArrowRight className="h-5 w-5" />
                                <span>{flight.to.name}</span>
                            </CardTitle>
                            <CardDescription>{flight.airline.name} - Flight {flight.id}</CardDescription>
                        </div>
                        <Badge className={cn("text-xs uppercase", statusStyles[status])}>{status}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(flight.departureTime)}</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{formatTime(flight.departureTime)} - {formatTime(flight.arrivalTime)}</span>
                    </div>
                </CardContent>
                <CardFooter className="gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/boarding-pass/${booking.id}`}>View Boarding Pass</Link>
                    </Button>
                    {status === 'upcoming' && (
                        <Button variant="destructive" size="sm" onClick={() => setIsCancelDialogOpen(true)}>
                            Cancel Booking
                        </Button>
                    )}
                </CardFooter>
            </Card>
            <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently cancel your booking for flight {booking.flight.id}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Go Back</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                updateBookingStatus(booking.id, 'cancelled');
                                setIsCancelDialogOpen(false);
                            }}
                            className={cn(buttonVariants({ variant: 'destructive' }))}
                        >
                            Confirm Cancellation
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}


export default function MyBookingsPage() {
    const { bookings } = useBooking();

    const upcomingBookings = bookings.filter(b => b.status === 'upcoming');
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

    const BookingList = ({ list, emptyMessage }: { list: Booking[], emptyMessage: string }) => {
        if (list.length === 0) {
            return (
                <div className="text-center py-16 text-muted-foreground bg-muted/40 rounded-lg">
                    <Plane className="mx-auto h-12 w-12 mb-4" />
                    <p>{emptyMessage}</p>
                </div>
            );
        }
        return (
            <div className="space-y-4">
                {list.map(booking => <BookingCard key={booking.id} booking={booking} />)}
            </div>
        )
    };

    return (
        <div className="container mx-auto max-w-4xl py-12 px-4">
            <h1 className="text-3xl font-bold mb-8 font-headline">My Bookings</h1>
            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
                    <BookingList list={upcomingBookings} emptyMessage="You have no upcoming flights. Time for an adventure?" />
                </TabsContent>
                <TabsContent value="completed">
                    <BookingList list={completedBookings} emptyMessage="You have no past flights in your history." />
                </TabsContent>
                <TabsContent value="cancelled">
                   <BookingList list={cancelledBookings} emptyMessage="No cancelled flights here." />
                </TabsContent>
            </Tabs>
        </div>
    );
}
