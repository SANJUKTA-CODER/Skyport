import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";
import { User, Shield } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/home" className="mr-6 flex items-center space-x-2">
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-lg">
            SkyPort
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link
            href="/home"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Find Flights
          </Link>
          <Link
            href="/my-bookings"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            My Bookings
          </Link>
        </nav>
        <div className="flex items-center justify-end space-x-2">
           <Button asChild variant="ghost" size="icon">
             <Link href="/profile">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
             </Link>
           </Button>
           <Button asChild variant="ghost" size="icon">
             <Link href="/admin">
                <Shield className="h-5 w-5" />
                <span className="sr-only">Admin</span>
             </Link>
           </Button>
        </div>
      </div>
    </header>
  );
}
