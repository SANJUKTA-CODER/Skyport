
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { generateFlights, Flight, AIRLINES, City, CITIES } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plane, ArrowRight, Clock, Globe } from "lucide-react";
import { format } from 'date-fns';

function FlightCard({ flight, searchParams }: { flight: Flight, searchParams: URLSearchParams }) {
  const formatTime = (date: Date) => format(date, 'HH:mm');

  const bookingUrl = `/booking?flightId=${flight.id}&${searchParams.toString()}`;
  
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1">
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-6 items-center gap-4">
        <div className="flex items-center gap-3 col-span-6 md:col-span-2">
          {flight.airline.logoUrl && 
            <Image 
              src={flight.airline.logoUrl} 
              alt={`${flight.airline.name} logo`} 
              width={40} 
              height={40} 
              className="rounded-full"
            />
          }
          <span className="font-medium text-sm">{flight.airline.name}</span>
        </div>
        <div className="col-span-6 md:col-span-3 flex items-center justify-between text-sm">
          <div className="text-center">
            <p className="font-bold text-lg">{formatTime(flight.departureTime)}</p>
            <p className="text-muted-foreground">{flight.from.code}</p>
          </div>
          <div className="text-center text-muted-foreground flex-grow mx-4">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4"/>
              <span>{Math.floor(flight.durationMinutes / 60)}h {flight.durationMinutes % 60}m</span>
            </div>
            <div className="w-full h-px bg-border my-1"></div>
            <p className="text-xs">Direct</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{formatTime(flight.arrivalTime)}</p>
            <p className="text-muted-foreground">{flight.to.code}</p>
          </div>
        </div>

        <div className="col-span-6 md:col-span-1 text-right space-y-1">
          <p className="font-bold text-xl text-primary">₹{flight.price.toLocaleString('en-IN')}</p>
          <Button asChild size="sm" className="w-full bg-accent hover:bg-accent/90 btn-glow">
            <Link href={bookingUrl}>Book Now</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AnimatedLoader() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/30 rounded-lg">
        <div className="relative w-48 h-48 flex items-center justify-center">
            <Globe className="w-24 h-24 text-primary/30 animate-spin" style={{ animationDuration: '20s' }} />
            <Plane className="absolute w-12 h-12 text-primary loader-plane-circle" />
        </div>
        <p className="text-lg font-semibold mt-4">Searching for the best flights...</p>
        <p className="text-muted-foreground">Please wait a moment.</p>
    </div>
  )
}

export default function FlightResults() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [durationRange, setDurationRange] = useState([0, 600]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');
  const passengers = search_params.get('passengers');

  useEffect(() => {
    if (from && to && date) {
      setLoading(true);
      setTimeout(() => { // Simulate network delay
        const fetchedFlights = generateFlights(from, to, date);
        setFlights(fetchedFlights);
        setLoading(false);
      }, 1500);
    }
  }, [from, to, date]);

  useEffect(() => {
    if (flights.length > 0) {
      const minPrice = Math.min(...flights.map(f => f.price));
      const maxPrice = Math.max(...flights.map(f => f.price));
      setPriceRange([minPrice, maxPrice]);

      const minDuration = Math.min(...flights.map(f => f.durationMinutes));
      const maxDuration = Math.max(...flights.map(f => f.durationMinutes));
      setDurationRange([minDuration, maxDuration]);

      setSelectedAirlines(AIRLINES.map(a => a.code));
    }
  }, [flights]);

  useEffect(() => {
    const filtered = flights.filter(flight => 
      flight.price >= priceRange[0] && flight.price <= priceRange[1] &&
      flight.durationMinutes >= durationRange[0] && flight.durationMinutes <= durationRange[1] &&
      selectedAirlines.includes(flight.airline.code)
    );
    setFilteredFlights(filtered);
  }, [priceRange, durationRange, selectedAirlines, flights]);

  const fromCity = useMemo(() => CITIES.find(c => c.code === from), [from]);
  const toCity = useMemo(() => CITIES.find(c => c.code === to), [to]);

  const handleAirlineChange = (airlineCode: string) => {
    setSelectedAirlines(prev => 
      prev.includes(airlineCode) 
        ? prev.filter(code => code !== airlineCode) 
        : [...prev, airlineCode]
    );
  };
  
  if (!from || !to || !date || !passengers) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Invalid search criteria. Please try again.</p>
        <Button onClick={() => router.push('/home')} className="mt-4">New Search</Button>
      </div>
    );
  }

  const minPrice = flights.length > 0 ? Math.min(...flights.map(f => f.price)) : 0;
  const maxPrice = flights.length > 0 ? Math.max(...flights.map(f => f.price)) : 15000;
  const minDuration = flights.length > 0 ? Math.min(...flights.map(f => f.durationMinutes)) : 0;
  const maxDuration = flights.length > 0 ? Math.max(...flights.map(f => f.durationMinutes)) : 600;

  return (
    <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-4 font-headline">
                <span>{fromCity?.name}</span>
                <ArrowRight className="h-6 w-6 text-primary" />
                <span>{toCity?.name}</span>
            </h1>
            <p className="text-muted-foreground">
                {format(new Date(date), 'EEEE, MMMM d')} &bull; {passengers} Passenger(s)
            </p>
        </div>
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</Label>
                <Slider
                  min={minPrice}
                  max={maxPrice}
                  step={500}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Duration: {Math.floor(durationRange[0]/60)}h - {Math.floor(durationRange[1]/60)}h</Label>
                <Slider
                  min={minDuration}
                  max={maxDuration}
                  step={15}
                  value={durationRange}
                  onValueChange={setDurationRange}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Airlines</Label>
                <div className="space-y-2 mt-2">
                  {AIRLINES.map(airline => (
                    <div key={airline.code} className="flex items-center space-x-2">
                      <Checkbox
                        id={airline.code}
                        checked={selectedAirlines.includes(airline.code)}
                        onCheckedChange={() => handleAirlineChange(airline.code)}
                      />
                      <Label htmlFor={airline.code} className="font-normal">{airline.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-3 space-y-4">
          {loading ? (
            <AnimatedLoader />
          ) : filteredFlights.length > 0 ? (
            filteredFlights.map(flight => <FlightCard key={flight.id} flight={flight} searchParams={searchParams} />)
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <p>No flights match your criteria.</p>
                <p className="text-sm">Try adjusting your filters or searching for a different route.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

    