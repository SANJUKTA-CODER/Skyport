import { PlaceHolderImages } from './placeholder-images';

// Types
export type City = {
  name: string;
  code: string;
};

export type Airline = {
  name: string;
  code: string;
  logoUrl: string;
};

export type Flight = {
  id: string;
  airline: Airline;
  from: City;
  to: City;
  departureTime: Date;
  arrivalTime: Date;
  durationMinutes: number;
  price: number;
  seats: Seat[];
};

export type Seat = {
  id: string;
  number: string;
  isAvailable: boolean;
};

export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export type Booking = {
  id: string;
  flight: Flight;
  passengerName: string;
  passengerEmail: string;
  seat: Seat;
  bookingTime: Date;
  status: BookingStatus;
};

// Mock Data
export const CITIES: City[] = [
  { name: 'New York', code: 'JFK' },
  { name: 'London', code: 'LHR' },
  { name: 'Tokyo', code: 'HND' },
  { name: 'Paris', code: 'CDG' },
  { name: 'Sydney', code: 'SYD' },
  { name: 'Dubai', code: 'DXB' },
  { name: 'Los Angeles', code: 'LAX' },
  { name: 'Singapore', code: 'SIN' },
  { name: 'Hong Kong', code: 'HKG' },
  { name: 'Frankfurt', code: 'FRA' },
];

export const AIRLINES: Airline[] = [
  { name: 'SkyBlue Airways', code: 'SA', logoUrl: PlaceHolderImages.find(p => p.id === 'airline-logo-1')?.imageUrl || '' },
  { name: 'Global Wings', code: 'GW', logoUrl: PlaceHolderImages.find(p => p.id === 'airline-logo-2')?.imageUrl || '' },
  { name: 'Horizon Flights', code: 'HF', logoUrl: PlaceHolderImages.find(p => p.id === 'airline-logo-3')?.imageUrl || '' },
];

function generateSeats(): Seat[] {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  for (let i = 1; i <= 20; i++) {
    for (const row of rows) {
      seats.push({
        id: `${i}${row}`,
        number: `${i}${row}`,
        isAvailable: Math.random() > 0.3, // 70% available
      });
    }
  }
  return seats;
}

const generateRandomFlight = (id: number, from: City, to: City): Flight => {
  const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
  const departureTime = new Date();
  departureTime.setDate(departureTime.getDate() + Math.floor(Math.random() * 14) + 1);
  departureTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

  const durationMinutes = Math.floor(Math.random() * 300) + 120; // 2 to 7 hours
  const arrivalTime = new Date(departureTime.getTime() + durationMinutes * 60000);
  const price = Math.floor(Math.random() * 800) + 200;

  return {
    id: `FL${1000 + id}`,
    airline,
    from,
    to,
    departureTime,
    arrivalTime,
    durationMinutes,
    price,
    seats: generateSeats(),
  };
};

export const generateFlights = (fromCode?: string, toCode?: string): Flight[] => {
  if (!fromCode || !toCode) return [];
  
  const fromCity = CITIES.find(c => c.code === fromCode);
  const toCity = CITIES.find(c => c.code === toCode);

  if (!fromCity || !toCity) return [];

  const flights: Flight[] = [];
  const numberOfFlights = Math.floor(Math.random() * 5) + 3; // 3 to 7 flights

  for (let i = 0; i < numberOfFlights; i++) {
    flights.push(generateRandomFlight(i, fromCity, toCity));
  }

  return flights;
};

export const ALL_FLIGHTS: Flight[] = CITIES.flatMap((fromCity) =>
  CITIES.filter((toCity) => toCity.code !== fromCity.code)
    .slice(0, 2)
    .flatMap((toCity, index) =>
      Array.from({ length: 2 }, (_, i) => generateRandomFlight(index * 100 + i, fromCity, toCity))
    )
);
