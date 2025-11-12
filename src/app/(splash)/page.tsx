"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plane, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation";

export default function WelcomePage() {
    const [isMounted, setIsMounted] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();

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
                        Book your journey with ease and comfort.
                    </p>
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size="lg"
                            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-7 px-10 rounded-full transition-all duration-300 hover:scale-105 btn-glow animate-pulse"
                            style={{ animationDelay: '0.8s', animationName: 'fade-in', animationFillMode: 'backwards' }}
                        >
                            Get Started
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] text-left">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-primary">Welcome to SkyPort</DialogTitle>
                            <DialogDescription>
                                New to SkyPort? Create an account to continue.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 flex flex-col gap-4">
                           <Button size="lg" onClick={() => router.push('/signup')}>Create Account <ArrowRight className="ml-2 h-4 w-4" /></Button>
                           <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <Link href="/login" className="underline text-primary font-medium" onClick={() => setIsDialogOpen(false)}>
                                    Login here
                                </Link>
                           </p>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            
            <div className="absolute bottom-6 z-10 fade-in" style={{ animationDelay: '1.2s' }}>
                <Link href="/login" passHref>
                    <Button variant="link" className="text-primary-foreground/80 hover:text-primary-foreground">
                        Skip Intro
                    </Button>
                </Link>
            </div>
        </div>
    );
}
