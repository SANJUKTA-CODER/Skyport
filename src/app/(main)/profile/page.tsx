import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { User, Settings, LogOut, Medal, Plane, Globe } from 'lucide-react';

export default function ProfilePage() {
    const avatarImage = PlaceHolderImages.find(p => p.id === 'profile-avatar');

    return (
        <>
            <div className="relative h-48 md:h-64 w-full gradient-sky">
                <div className="container mx-auto px-4 h-full flex items-end pb-8">
                     <div className="flex items-end gap-4">
                        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
                            {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt="User Avatar" data-ai-hint={avatarImage.imageHint} />}
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground text-glow">Jane Doe</h1>
                            <p className="text-primary-foreground/80">jane.doe@example.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Travel Stats</CardTitle>
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
                                        <p className="font-semibold">12 Flights Taken</p>
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
                        <Button className="w-full justify-start text-base py-6" variant="outline"><User className="mr-3" /> Edit Profile</Button>
                        <Button className="w-full justify-start text-base py-6" variant="outline"><Settings className="mr-3" /> Settings</Button>
                        <Button className="w-full justify-start text-base py-6" variant="destructive"><LogOut className="mr-3" /> Logout</Button>
                    </div>
                </div>
            </div>
        </>
    );
}
