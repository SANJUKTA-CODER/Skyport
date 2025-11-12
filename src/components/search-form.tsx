"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, ChevronsUpDown, Users, Plane, Minus, Plus, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { CITIES } from "@/lib/data";

const searchFormSchema = z.object({
  from: z.string().min(1, "Please select a departure city").regex(/^[a-zA-Z\s]+$/, "Enter a valid city name"),
  to: z.string().min(1, "Please select a destination city").regex(/^[a-zA-Z\s]+$/, "Enter a valid city name"),
  journeyDate: z.date({ required_error: "Please select a journey date" }),
  returnDate: z.date().optional(),
  passengers: z.number().min(1, "At least one passenger is required").max(8, "Maximum of 8 passengers"),
  travelClass: z.string().optional(),
}).refine(data => data.from !== data.to, {
  message: "Departure and Destination cannot be the same.",
  path: ["to"],
}).refine(data => !data.returnDate || data.returnDate > data.journeyDate, {
  message: "Return date must be after journey date.",
  path: ["returnDate"],
});


type SearchFormValues = z.infer<typeof searchFormSchema>;

export function SearchForm() {
  const router = useRouter();

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    mode: "onChange",
    defaultValues: {
      from: "",
      to: "",
      passengers: 1,
      travelClass: "economy",
    },
  });

  const onSubmit = (data: SearchFormValues) => {
    const params = new URLSearchParams({
      from: CITIES.find(c => c.name === data.from)?.code || '',
      to: CITIES.find(c => c.name === data.to)?.code || '',
      date: format(data.journeyDate, "yyyy-MM-dd"),
      passengers: String(data.passengers),
    });
    if (data.returnDate) {
      params.append('returnDate', format(data.returnDate, "yyyy-MM-dd"));
    }
    if (data.travelClass) {
      params.append('class', data.travelClass);
    }
    router.push(`/flights?${params.toString()}`);
  };

  const CityCombobox = ({ field, placeholder, name }: { field: any; placeholder: string, name: "from" | "to" }) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between text-left font-normal h-11",
                !field.value && "text-muted-foreground",
                form.getFieldState(name).invalid ? "border-destructive" : form.getFieldState(name).isDirty && !form.getFieldState(name).invalid ? "border-green-500" : ""
              )}
            >
              <div className="flex items-center gap-2">
                <Plane className="h-4 w-4" />
                {field.value || placeholder}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search city..." />
            <CommandList>
              <CommandEmpty>No city found.</CommandEmpty>
              <CommandGroup>
                {CITIES.map((city) => (
                  <CommandItem
                    value={city.name}
                    key={city.code}
                    onSelect={() => {
                      form.setValue(field.name, city.name);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        city.name === field.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {city.name} ({city.code})
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };
  
  return (
    <Card className="bg-background/80 backdrop-blur-sm">
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-start">
            
            <div className="lg:col-span-3 md:col-span-1">
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <CityCombobox field={field} placeholder="Departure city" name="from"/>
                    <FormMessage className="text-destructive text-xs fade-in" />
                  </FormItem>
                )}
              />
            </div>

            <div className="lg:col-span-3 md:col-span-1">
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <CityCombobox field={field} placeholder="Destination city" name="to"/>
                    <FormMessage className="text-destructive text-xs fade-in" />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="lg:col-span-2">
              <FormField
                control={form.control}
                name="journeyDate"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Journey Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal h-11",
                              !field.value && "text-muted-foreground",
                              fieldState.invalid ? "border-destructive" : ""
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-destructive text-xs fade-in" />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="lg:col-span-2">
              <FormField
                control={form.control}
                name="returnDate"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Return Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal h-11",
                              !field.value && "text-muted-foreground",
                               fieldState.invalid ? "border-destructive" : ""
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date (Optional)</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < (form.getValues("journeyDate") || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                     <FormMessage className="text-destructive text-xs fade-in" />
                  </FormItem>
                )}
              />
            </div>

            <div className="lg:col-span-2 grid grid-cols-2 gap-2">
               <FormField
                control={form.control}
                name="passengers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passengers</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button variant="outline" className="w-full justify-start font-normal h-11">
                                <Users className="mr-2 h-4 w-4" />
                                {field.value}
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-48">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Passengers</span>
                                <div className="flex items-center gap-1">
                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => field.value > 1 && field.onChange(field.value - 1)}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-6 text-center">{field.value}</span>
                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => field.value < 8 && field.onChange(field.value + 1)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <FormMessage className="text-destructive text-xs fade-in" />
                  </FormItem>
                )}
              />
                <FormField
                  control={form.control}
                  name="travelClass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                             <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                <SelectValue placeholder="Select class" />
                             </div>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="economy">Economy</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="first">First</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-destructive text-xs fade-in" />
                    </FormItem>
                  )}
                />
            </div>
            

            <Button type="submit" className="lg:col-span-12 w-full mt-4" size="lg">
              Search Flights
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
