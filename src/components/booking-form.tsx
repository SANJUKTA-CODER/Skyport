
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const passengerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  age: z.coerce.number().min(1, "Age must be at least 1.").max(120, "Enter a valid age."),
  gender: z.string().min(1, "Gender is required."),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone number."),
});

const bookingFormSchema = z.object({
  passengers: z.array(passengerSchema).min(1, "At least one passenger is required."),
  selectedSeats: z.array(z.string()).min(1, "Please select at least one seat."),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export function BookingForm({ flight }: { flight: Flight }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const passengerCount = parseInt(searchParams.get('passengers') || '1', 10);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    mode: "onChange",
    defaultValues: {
      passengers: Array(passengerCount).fill({ name: "", age: "", gender: "", email: "", phone: "" }),
      selectedSeats: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "passengers",
  });
  
  const selectedSeats = form.watch("selectedSeats");

  useEffect(() => {
    const currentPassengers = form.getValues('passengers').length;
    if (currentPassengers !== passengerCount) {
      const newPassengers = Array(passengerCount).fill({ name: "", age: "", gender: "", email: "", phone: "" });
      form.reset({ passengers: newPassengers, selectedSeats: [] });
    }
  }, [passengerCount, form]);

  const onSubmit = (data: BookingFormValues) => {
    if (data.selectedSeats.length !== data.passengers.length) {
        toast({
            variant: 'destructive',
            title: 'Seat Selection Error',
            description: `Please select exactly ${data.passengers.length} seat(s) for ${data.passengers.length} passenger(s).`,
        });
        return;
    }

    const bookingData = {
        flightId: flight.id,
        passengers: data.passengers,
        selectedSeats: data.selectedSeats,
        date: searchParams.get('date'),
        passengersCount: passengerCount
    };
    
    // Using sessionStorage to pass larger data that might exceed URL length limits
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('skyport-booking-data', JSON.stringify(bookingData));
    }
    
    router.push(`/payment`);
  };

  const handleSelectSeat = (seatId: string) => {
    const currentSeats = form.getValues("selectedSeats");
    const isSelected = currentSeats.includes(seatId);
    let newSeats: string[];

    if (isSelected) {
      newSeats = currentSeats.filter(id => id !== seatId);
    } else {
      if (currentSeats.length >= passengerCount) {
        toast({
          variant: 'destructive',
          title: 'Seat limit reached',
          description: `Seat limit reached for selected passengers.`
        });
        return;
      }
      newSeats = [...currentSeats, seatId];
    }
    form.setValue("selectedSeats", newSeats, { shouldValidate: true });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {fields.map((item, index) => (
            <Card key={item.id}>
            <CardHeader>
                <CardTitle>Passenger {index + 1}</CardTitle>
                <CardDescription>Enter the details for this passenger.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name={`passengers.${index}.name`}
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
                    name={`passengers.${index}.age`}
                    render={({ field, fieldState }) => (
                        <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="25" {...field} className={cn(fieldState.invalid ? 'border-destructive' : fieldState.isDirty && !fieldState.invalid ? 'border-green-500' : '')} />
                        </FormControl>
                        <FormMessage className="text-destructive text-xs" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`passengers.${index}.gender`}
                    render={({ field, fieldState }) => (
                        <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                            <Input placeholder="Male / Female / Other" {...field} className={cn(fieldState.invalid ? 'border-destructive' : fieldState.isDirty && !fieldState.invalid ? 'border-green-500' : '')} />
                        </FormControl>
                        <FormMessage className="text-destructive text-xs" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`passengers.${index}.email`}
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
                <FormField
                    control={form.control}
                    name={`passengers.${index}.phone`}
                    render={({ field, fieldState }) => (
                        <FormItem className="md:col-span-2">
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                            <Input placeholder="9876543210" {...field} className={cn(fieldState.invalid ? 'border-destructive' : fieldState.isDirty && !fieldState.invalid ? 'border-green-500' : '')} />
                        </FormControl>
                        <FormMessage className="text-destructive text-xs" />
                        </FormItem>
                    )}
                />
            </CardContent>
            </Card>
        ))}
        
        <Card>
          <CardHeader>
            <CardTitle>Select Your Seat(s)</CardTitle>
            <CardDescription>Choose {passengerCount} seat(s) from the layout below.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="selectedSeats"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SeatSelection 
                      seats={flight.seats}
                      selectedSeats={field.value}
                      onSelectSeat={handleSelectSeat}
                      passengerCount={passengerCount}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive text-xs text-center" />
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

    