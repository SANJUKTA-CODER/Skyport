"use client"

import { Suspense } from 'react';
import { PaymentForm } from '@/components/payment-form';

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
        <Suspense fallback={<div className="container mx-auto py-12 text-center">Loading payment details...</div>}>
            <PaymentPage />
        </Suspense>
    )
}
