import { SearchForm } from '@/components/search-form';
import { PopularRoutes } from '@/components/popular-routes';

export default function HomePage() {
  return (
    <>
      <section className="relative h-[70vh] min-h-[550px] flex items-center justify-center text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 gradient-sky -z-10" />
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-glow font-headline">
            Your Journey Begins Here
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 drop-shadow-lg">
            Discover seamless travel with SkyPort. Find the best flights, book with confidence, and explore the world.
          </p>
          <div className="max-w-4xl mx-auto">
            <SearchForm />
          </div>
        </div>
      </section>
      <PopularRoutes />
    </>
  );
}
