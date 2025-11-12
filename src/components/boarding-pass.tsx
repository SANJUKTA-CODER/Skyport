import type { Booking } from "@/lib/data";
import { QrCode } from "@/components/qr-code";
import { format } from "date-fns";
import { ArrowRight, Plane, Clock, Armchair, User, Download, Share2 } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

export function BoardingPass({ booking }: { booking: Booking }) {
    const { flight, passengerName, seat } = booking;
    const formatTime = (date: Date) => format(new Date(date), 'HH:mm');
    const formatDate = (date: Date) => format(new Date(date), 'MMM d, yyyy');

    return (
        <div className="bg-card text-card-foreground shadow-2xl rounded-2xl overflow-hidden font-sans">
            <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">BOARDING PASS</h1>
                <div className="flex items-center gap-2">
                    <span className="text-sm">{flight.airline.name}</span>
                    {flight.airline.logoUrl && <Image src={flight.airline.logoUrl} alt="airline logo" width={30} height={30} className="rounded-full bg-white" />}
                </div>
            </header>

            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-primary">{flight.from.code}</p>
                        <p className="text-sm text-muted-foreground">{flight.from.name}</p>
                    </div>
                    <Plane className="w-8 h-8 text-muted-foreground" />
                    <div className="text-center">
                        <p className="text-4xl font-bold text-primary">{flight.to.code}</p>
                        <p className="text-sm text-muted-foreground">{flight.to.name}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <div>
                        <p className="text-muted-foreground text-xs">PASSENGER</p>
                        <p className="font-semibold">{passengerName}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs">FLIGHT</p>
                        <p className="font-semibold">{flight.id}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs">DATE</p>
                        <p className="font-semibold">{formatDate(flight.departureTime)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs">DEPARTS</p>
                        <p className="font-semibold">{formatTime(flight.departureTime)}</p>
                    </div>
                     <div>
                        <p className="text-muted-foreground text-xs">SEAT</p>
                        <p className="font-semibold text-lg text-primary">{seat.number}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs">GATE</p>
                        <p className="font-semibold text-lg">B12</p>
                    </div>
                </div>
            </div>

            <div className="border-t-2 border-dashed border-border"></div>

            <div className="p-6 flex items-center gap-6 bg-muted/50">
                <div className="flex-1 space-y-4 text-sm">
                    <div>
                        <p className="text-muted-foreground text-xs">PASSENGER</p>
                        <p className="font-semibold">{passengerName}</p>
                    </div>
                    <div className="flex justify-between">
                         <div>
                            <p className="text-muted-foreground text-xs">FROM</p>
                            <p className="font-semibold">{flight.from.code}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-xs">TO</p>
                            <p className="font-semibold">{flight.to.code}</p>
                        </div>
                         <div>
                            <p className="text-muted-foreground text-xs">SEAT</p>
                            <p className="font-semibold">{seat.number}</p>
                        </div>
                    </div>
                </div>
                <div className="w-24 h-24 p-1 bg-white rounded-md shadow-md">
                    <QrCode />
                </div>
            </div>

             <div className="p-4 bg-card border-t flex items-center justify-center gap-4">
                <Button variant="outline"><Download className="mr-2" /> Download</Button>
                <Button variant="outline"><Share2 className="mr-2" /> Share</Button>
            </div>
        </div>
    );
}
