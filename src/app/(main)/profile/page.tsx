"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { User, Settings, LogOut, Medal, Plane, Globe, Edit } from 'lucide-react';
import { useBooking } from '@/context/booking-context';
import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
  

export default function ProfilePage() {
    const avatarImage = PlaceHolderImages.find(p => p.id === 'profile-avatar');
    const { bookings } = useBooking();
    const { toast } = useToast();

    const [user, setUser] = useState({ name: 'Jane Doe', email: 'jane.doe@example.com' });
    const [isMounted, setIsMounted] = useState(false);
    const [editName, setEditName] = useState(user.name);
    const [editEmail, setEditEmail] = useState(user.email);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const storedUser = localStorage.getItem('skyport-user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser({ name: parsedUser.fullName, email: parsedUser.email });
            setEditName(parsedUser.fullName);
            setEditEmail(parsedUser.email);
        }
    }, []);

    const handleProfileUpdate = () => {
        const updatedUser = { name: editName, email: editEmail };
        setUser(updatedUser);
        if (typeof window !== 'undefined') {
            localStorage.setItem('skyport-user', JSON.stringify({ fullName: editName, email: editEmail }));
        }
        toast({
            title: "Profile Updated",
            description: "Your profile has been updated successfully.",
        });
        setIsEditDialogOpen(false);
    }
    
    if (!isMounted) {
        return null; // or a loading skeleton
    }

    return (
        <>
            <div className="relative h-48 md:h-64 w-full gradient-sky">
                <div className="container mx-auto px-4 h-full flex items-end pb-8">
                     <div className="flex items-end gap-4">
                        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
                            {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt="User Avatar" data-ai-hint={avatarImage.imageHint} />}
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground text-glow">{user.name}</h1>
                            <p className="text-primary-foreground/80">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <Card>
                             <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Travel Stats</CardTitle>
                                <CardDescription>Total Bookings: {bookings.length}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center">
                                    <Medal className="h-6 w-6 mr-4 text-accent" />
                                    <div>
                                        <p className="font-semibold">Voyager Tier: Gold</p>
                                        <p className="text-sm text-muted-foreground">2,500 points to Platinum</p>
                                        <Progress value={60} className="mt-2 h-2" />
                                    </div>
                                </div>
                                 <div className="flex items-center">
                                    <Plane className="h-6 w-6 mr-4 text-primary" />
                                    <div>
                                        <p className="font-semibold">{bookings.filter(b => b.status === 'completed').length} Flights Taken</p>
                                        <p className="text-sm text-muted-foreground">with SkyPort this year</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Globe className="h-6 w-6 mr-4 text-green-500" />
                                    <div>
                                        <p className="font-semibold">8 Countries Visited</p>
                                        <p className="text-sm text-muted-foreground">You're a true explorer!</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="md:col-span-1 space-y-4">
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-full justify-start text-base py-6" variant="outline"><Edit className="mr-3" /> Edit Profile</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                <DialogTitle>Edit profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click save when you're done.
                                </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                    Name
                                    </Label>
                                    <Input id="name" value={editName} onChange={(e) => setEditName(e.target.value)} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">
                                    Email
                                    </Label>
                                    <Input id="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="col-span-3" />
                                </div>
                                </div>
                                <DialogFooter>
                                <Button type="submit" onClick={handleProfileUpdate}>Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Button className="w-full justify-start text-base py-6" variant="outline"><Settings className="mr-3" /> Settings</Button>
                        <Button className="w-full justify-start text-base py-6" variant="destructive"><LogOut className="mr-3" /> Logout</Button>
                    </div>
                </div>
            </div>
        </>
    );
}
