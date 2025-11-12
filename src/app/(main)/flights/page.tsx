import { Suspense } from 'react';
import FlightResults from '@/components/flight-results';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Globe, Plane } from 'lucide-react';

function FlightResultsSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-2/3" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-1/3 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-3 space-y-4">
          <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/30 rounded-lg">
              <div className="relative w-48 h-48 flex items-center justify-center">
                  <Globe className="w-24 h-24 text-primary/30 animate-spin" style={{ animationDuration: '20s' }} />
                  <Plane className="absolute w-12 h-12 text-primary loader-plane-circle" />
              </div>
              <p className="text-lg font-semibold mt-4">Searching for the best flights...</p>
              <p className="text-muted-foreground">Please wait a moment.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FlightsPage() {
  return (
    <Suspense fallback={<FlightResultsSkeleton />}>
      <FlightResults />
    </Suspense>
  );
}
