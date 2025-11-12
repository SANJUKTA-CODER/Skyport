import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AdminCharts } from '@/components/admin-charts';
import { DollarSign, Plane, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const recentBookings = [
    { id: 'FL1023', route: 'JFK → LHR', fare: 540, status: 'Completed' },
    { id: 'FL1298', route: 'CDG → DXB', fare: 890, status: 'Upcoming' },
    { id: 'FL1543', route: 'SYD → LAX', fare: 1250, status: 'Upcoming' },
    { id: 'FL1102', route: 'HND → FRA', fare: 980, status: 'Cancelled' },
    { id: 'FL1765', route: 'SIN → HKG', fare: 350, status: 'Completed' },
];

export default function AdminDashboardPage() {
    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8 font-headline">Admin Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                        <Plane className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">+19% from last month</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-5 gap-8 mb-8">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Bookings Overview</CardTitle>
                        <CardDescription>Monthly booking data</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AdminCharts />
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Bookings</CardTitle>
                        <CardDescription>A list of recent bookings on the platform.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Flight No.</TableHead>
                                    <TableHead>Route</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentBookings.map(booking => (
                                    <TableRow key={booking.id}>
                                        <TableCell className="font-medium">{booking.id}</TableCell>
                                        <TableCell>{booking.route}</TableCell>
                                        <TableCell className="text-right"><Badge variant={booking.status === 'Completed' ? 'secondary' : booking.status === 'Cancelled' ? 'destructive' : 'default'} className={cn(booking.status === 'Upcoming' && 'bg-blue-500 text-white')}>{booking.status}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
