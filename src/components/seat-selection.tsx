"use client";

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
  selectedSeat,
  onSelectSeat,
}: {
  seats: Seat[];
  selectedSeat: string | null;
  onSelectSeat: (seatId: string) => void;
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
              <>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            key={seat.id}
                            disabled={!seat.isAvailable}
                            onClick={() => onSelectSeat(seat.id)}
                            className={cn(
                                "p-1 rounded-md transition-colors",
                                {
                                "text-muted-foreground/50 cursor-not-allowed": !seat.isAvailable,
                                "text-primary hover:bg-primary/10": seat.isAvailable,
                                "bg-primary text-primary-foreground hover:bg-primary/90": selectedSeat === seat.id,
                                }
                            )}
                            >
                            <Armchair className="w-6 h-6"/>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Seat {seat.number} - {seat.isAvailable ? 'Available' : 'Occupied'}</p>
                    </TooltipContent>
                </Tooltip>
                {seatIndex === 2 && <div className="w-6" />}
              </>
            ))}
          </div>
        ))}
      </div>
       <div className="flex gap-4 mt-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2"><Armchair className="w-5 h-5 text-primary" /> Available</div>
        <div className="flex items-center gap-2"><Armchair className="w-5 h-5 bg-primary text-primary-foreground rounded-sm" /> Selected</div>
        <div className="flex items-center gap-2"><Armchair className="w-5 h-5 text-muted-foreground/50" /> Occupied</div>
       </div>
    </div>
    </TooltipProvider>
  );
}
