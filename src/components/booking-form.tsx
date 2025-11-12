"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Flight } from "@/lib/data";
import { SeatSelection } from "@/components/seat-selection";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const bookingFormSchema = z.object({
  passengerName: z.string().min(2, "Name must be at least 2 characters."),
  passengerEmail: z.string().email("Please enter a valid email address."),
  selectedSeat: z.string().min(1, "Please select a seat."),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export function BookingForm({ flight }: { flight: Flight }) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    mode: "onChange",
    defaultValues: {
      passengerName: "",
      passengerEmail: "",
      selectedSeat: "",
    },
  });

  const onSubmit = (data: BookingFormValues) => {
    const seat = flight.seats.find(s => s.id === data.selectedSeat);
    if (!seat) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Selected seat is not valid. Please try again.',
        });
        return;
    }

    const params = new URLSearchParams({
      flightId: flight.id,
      passengerName: data.passengerName,
      passengerEmail: data.passengerEmail,
      selectedSeat: data.selectedSeat,
    });
    router.push(`/payment?${params.toString()}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Passenger Information</CardTitle>
            <CardDescription>Enter the details of the person traveling.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="passengerName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className={cn(fieldState.invalid ? 'border-destructive' : fieldState.isDirty && !fieldState.invalid ? 'border-green-500' : '')} />
                  </FormControl>
                  <FormMessage className="text-destructive text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passengerEmail"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} className={cn(fieldState.invalid ? 'border-destructive' : fieldState.isDirty && !fieldState.invalid ? 'border-green-500' : '')} />
                  </FormControl>
                  <FormMessage className="text-destructive text-xs" />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Select Your Seat</CardTitle>
            <CardDescription>Choose an available seat from the layout below.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="selectedSeat"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SeatSelection 
                      seats={flight.seats}
                      selectedSeat={field.value}
                      onSelectSeat={field.onChange}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive text-xs" />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 btn-glow">
          Proceed to Payment
        </Button>
      </form>
    </Form>
  );
}
