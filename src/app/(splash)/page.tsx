"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";
import { useEffect, useState } from "react";

export default function SplashPage() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 gradient-sky" />
            <div className="absolute inset-0 bg-black/20" />
            
            <Plane className="absolute text-white/50 w-64 h-64 animate-plane-takeoff" style={{ animationDuration: '6s' }} />

            <div className="relative z-10 text-center text-primary-foreground px-4">
                <div className="fade-in" style={{ animationDuration: '1.2s' }}>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-glow font-headline uppercase">
                        SKYPORT
                    </h1>
                    <p className="text-xl md:text-2xl mt-4 mb-10 opacity-90 font-light" style={{ animationDelay: '0.3s', animationName: 'fade-in', animationFillMode: 'backwards' }}>
                        Your flight, your way.
                    </p>
                </div>
                
                <Link href="/home" passHref>
                    <Button
                        size="lg"
                        className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-7 px-10 rounded-full transition-all duration-300 hover:scale-105 btn-glow animate-pulse"
                        style={{ animationDelay: '0.8s', animationName: 'fade-in', animationFillMode: 'backwards' }}
                    >
                        Start Now
                    </Button>
                </Link>
            </div>
        </div>
    );
}
