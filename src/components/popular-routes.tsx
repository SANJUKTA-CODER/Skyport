import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';

const popularRoutesData = [
  { id: 'route-1', from: 'New York', to: 'London', imageId: 'popular-route-1' },
  { id: 'route-2', from: 'Paris', to: 'Tokyo', imageId: 'popular-route-2' },
  { id: 'route-3', from: 'Sydney', to: 'Los Angeles', imageId: 'popular-route-3' },
  { id: 'route-4', from: 'Dubai', to: 'Singapore', imageId: 'popular-route-4' },
  { id: 'route-5', from: 'Hong Kong', to: 'Frankfurt', imageId: 'popular-route-5' },
];

export function PopularRoutes() {
  return (
    <section className="container mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-10 font-headline">Popular Routes</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {popularRoutesData.map((route) => {
            const image = PlaceHolderImages.find(p => p.id === route.imageId);
            return (
              <CarouselItem key={route.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="overflow-hidden group rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <CardContent className="p-0 relative">
                      {image && (
                        <Image
                          src={image.imageUrl}
                          alt={`Image for route from ${route.from} to ${route.to}`}
                          width={600}
                          height={400}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          data-ai-hint={image.imageHint}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-4 text-primary-foreground">
                        <h3 className="text-lg font-semibold flex items-center gap-2 text-glow">
                          {route.from} <ArrowRight className="h-4 w-4" /> {route.to}
                        </h3>
                      </div>
                      <Link href={`/flights?from=${route.from.substring(0,3).toUpperCase()}&to=${route.to.substring(0,3).toUpperCase()}&date=2024-12-25&passengers=1`} className="absolute inset-0">
                        <span className="sr-only">View flights from {route.from} to {route.to}</span>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </section>
  );
}
