"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plane, ArrowRight, CheckCircle } from "lucide-react";
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
        return null; // Or a loading skeleton
    }

    return (
        <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden p-4 text-center">
            <div className="absolute inset-0 gradient-sky" />
            <div className="absolute inset-0 bg-black/10" />

            <div className="relative z-10 text-primary-foreground max-w-4xl mx-auto">
                <div className="fade-in">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-glow font-headline uppercase">
                        SKYPORT
                    </h1>
                    <p className="text-xl md:text-2xl mt-2 mb-6 opacity-95 font-light">
                        Your Gateway to the Skies
                    </p>
                    <p className="text-base md:text-lg max-w-2xl mx-auto mb-6">
                        Book your air travel with speed, simplicity, and smarter search.
                    </p>
                </div>
                
                <div className="fade-in-delay-1 bg-black/20 backdrop-blur-sm rounded-xl p-6 md:p-8 space-y-6">
                    <p className="text-base md:text-lg">
                        SkyPort brings Indian travellers the fastest way to compare airlines, pick seats visually, and pay securely – all in one elegant interface built for comfort and clarity.
                    </p>
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Why SkyPort?</h2>
                        <ul className="space-y-3 text-left inline-block">
                            <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-accent" /> Instant flight comparisons</li>
                            <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-accent" /> Visual seat selection</li>
                            <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-accent" /> Unified Indian-rupee checkout</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 fade-in-delay-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                size="lg"
                                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-7 px-10 rounded-full transition-all duration-300 hover:scale-105 animate-soft-pulse"
                            >
                                Get Started
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] text-left">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-primary">Welcome to SkyPort</DialogTitle>
                                <DialogDescription>
                                   New to SkyPort? Create an account or login to continue.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 flex flex-col gap-4">
                               <Button size="lg" onClick={() => router.push('/signup')}>Create Account <ArrowRight className="ml-2 h-4 w-4" /></Button>
                               <Button size="lg" variant="outline" onClick={() => router.push('/login')}>Login</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <div className="mt-4">
                        <Link href="/login" passHref>
                            <Button variant="link" className="text-primary-foreground/80 hover:text-primary-foreground">
                                Skip Intro
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
