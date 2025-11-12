"use client"

import { Suspense } from 'react';
import { PaymentForm } from '@/components/payment-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function PaymentPageSkeleton() {
    return (
        <div className="container mx-auto max-w-4xl py-12 px-4">
            <Skeleton className="h-10 w-1/3 mb-8" />
             <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle><Skeleton className="h-6 w-1/2" /></CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-14 w-full" />
                            <Skeleton className="h-14 w-full" />
                            <Skeleton className="h-14 w-full" />
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle><Skeleton className="h-6 w-3/4" /></CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-1/3" />
                            <div className="border-t pt-4 mt-4">
                                <Skeleton className="h-8 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
             <div className="mt-8 text-center">
                <Skeleton className="h-12 w-full md:w-1/2" />
            </div>
        </div>
    );
}


function PaymentPage() {
    return (
        <div className="container mx-auto max-w-4xl py-12 px-4">
            <h1 className="text-3xl font-bold mb-8 font-headline">Secure Payment</h1>
            <PaymentForm />
        </div>
    );
}

export default function PaymentPageWrapper() {
    return (
        <Suspense fallback={<PaymentPageSkeleton />}>
            <PaymentPage />
        </Suspense>
    )
}
