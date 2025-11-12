"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { Seat } from "@/lib/data";
import { Armchair } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


export function SeatSelection({
  seats,
  selectedSeats,
  onSelectSeat,
  passengerCount,
}: {
  seats: Seat[];
  selectedSeats: string[];
  onSelectSeat: (seatId: string) => void;
  passengerCount: number;
}) {
  const seatRows: Seat[][] = [];
  for (let i = 0; i < seats.length; i += 6) {
    seatRows.push(seats.slice(i, i + 6));
  }

  return (
    <TooltipProvider>
    <div className="bg-muted/30 p-4 rounded-lg flex flex-col items-center">
      <div className="w-full bg-card p-2 rounded-t-xl mb-4 text-center text-sm font-medium text-muted-foreground">
        Front of Plane
      </div>
      <div className="space-y-2">
        {seatRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-2">
            {row.map((seat, seatIndex) => (
              <React.Fragment key={seat.id}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            disabled={!seat.isAvailable && !selectedSeats.includes(seat.id)}
                            onClick={() => onSelectSeat(seat.id)}
                            className={cn(
                                "p-1 rounded-md transition-colors",
                                {
                                "text-red-500/50 cursor-not-allowed": !seat.isAvailable,
                                "text-blue-500 hover:bg-blue-500/10": seat.isAvailable,
                                "bg-green-500 text-white hover:bg-green-500/90": selectedSeats.includes(seat.id),
                                }
                            )}
                            >
                            <Armchair className="w-6 h-6"/>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Seat {seat.number} - {!seat.isAvailable && !selectedSeats.includes(seat.id) ? 'Booked' : 'Available'}</p>
                    </TooltipContent>
                </Tooltip>
                {seatIndex === 2 && <div className="w-6" />}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
       <div className="flex gap-4 mt-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2"><Armchair className="w-5 h-5 text-blue-500" /> Available</div>
        <div className="flex items-center gap-2"><Armchair className="w-5 h-5 bg-green-500 text-white rounded-sm p-0.5" /> Selected</div>
        <div className="flex items-center gap-2"><Armchair className="w-5 h-5 text-red-500/50" /> Booked</div>
       </div>
    </div>
    </TooltipProvider>
  );
}
