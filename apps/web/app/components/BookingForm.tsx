'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PriceBreakdown from './PriceBreakDown';
import { createBooking, fetchPriceBreakdown } from '../../lib/clientApi';

interface EventType {
  id: number;
  basePrice: number;
  currentPrice: number;
  totalTickets: number;
  bookedTickets: number;
  priceBreakDown: any; // could be typed further based on API
}

interface BookingFormProps {
  event: EventType;
  initialPrice: number;
}

interface PriceBreakdownData {
  breakdown: {
    timeAmount?: number;
    demandAmount?: number;
    inventoryAmount?: number;
  };
}

export default function BookingForm({ event, initialPrice }: BookingFormProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [priceBreakdownData, setPriceBreakdownData] = useState<PriceBreakdownData | null>(null);
  const [isPriceBreakdownCompleted, setIsPriceBreakdownCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(Number(process.env.NEXT_PUBLIC_BOOKING_TIMER) || 120);
  const [bookingStarted, setBookingStarted] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);


  useEffect(() => {
    if (bookingStarted) return;

    if (timeLeft <= 0) {
      router.replace('/events');
      setTimeout(() => {
        window.location.replace('/events');
      }, 50);
      return;
    }

    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, bookingStarted, router]);


  async function handlePriceCalculationSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await fetchPriceBreakdown(event.id, quantity, event.priceBreakDown);
      setPriceBreakdownData(data);
      setIsPriceBreakdownCompleted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to calculate price');
    } finally {
      setLoading(false);
    }
  }


  async function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBookingStarted(true);
    setLoading(true);
    setError(null);

    try {
      const bookingData = {
        eventId: event.id,
        userEmail: email,
        quantity,
        priceBreakdown: priceBreakdownData,
        currentPrice: event.currentPrice,
      };
      const response = await createBooking(bookingData);
      const bookingId = response?.data?.id;
      if (!bookingId) throw new Error('Booking ID not found in response');

      router.replace(`/bookings/success?id=${bookingId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
      setBookingStarted(false);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    const handlePopState = () => {
      if (bookingStarted || timeLeft <= 0) {
        router.replace('/view-events');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [bookingStarted, timeLeft, router]);

  return (
    <div className="relative space-y-6">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/20 cursor-not-allowed">
          <div className="w-16 h-16 border-4 border-transparent border-t-blue-600 border-r-orange-400 rounded-full animate-spin"></div>
        </div>
      )}

  
      <form onSubmit={handlePriceCalculationSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Quantity</label>
          <input
            type="number"
            min={1}
            max={event.totalTickets - event.bookedTickets}
            value={quantity}
            onChange={(e) => {
              setQuantity(Number(e.target.value));
              setIsPriceBreakdownCompleted(false);
            }}
            className="mt-1 w-24 p-2 border rounded"
          />

          <label className="block text-sm mt-2">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>Price (est.)</div>
          <div className="font-semibold">{formatPrice(initialPrice * quantity)}</div>
        </div>

        {error && <div className="text-red-600">{error}</div>}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2 rounded-full border-2 border-orange-500 text-orange-500 font-medium hover:bg-orange-500 hover:text-white transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Calculating...' : 'Calculate Price'}
          </button>
        </div>
      </form>

   
      {isPriceBreakdownCompleted && priceBreakdownData && (
        <form onSubmit={handleFinalSubmit} className="bg-white p-4 rounded shadow space-y-3">
          <PriceBreakdown
            eventId={event.id}
            quantity={quantity}
            priceBreakdown={priceBreakdownData.breakdown}
            basePrice={event.basePrice}
            serverCurrentPrice={event.currentPrice}
          />

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-orange-400 text-white font-medium hover:opacity-90 transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
