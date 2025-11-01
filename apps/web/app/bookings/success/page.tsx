import React from 'react';
import { getBookingById, getEventById } from '../../../lib/api';

export interface PriceBreakdown {
  pricePaid: number;
  basePrice: number;
  timePercentage: number;
  timeAmount: number;
  demandPercentage: number;
  demandAmount: number;
  inventoryPercentage: number;
  inventoryAmount: number;
}

interface Booking {
  id: number;
  eventId: number;
  quantity: number;
  pricePaid: number;
  priceBreakdown: {
    basePrice: number;
    breakdown: PriceBreakdown;
  };
}

interface Event {
  id: number;
  name: string;
  currentPrice?: number;
}

interface BookingSuccessProps {
  searchParams?: { id?: string };
}

export default async function BookingSuccess({ searchParams }: BookingSuccessProps) {
  const id = Number(searchParams?.id);
  if (!id) {
    return <div className="p-4 text-center text-red-600">Missing booking ID</div>;
  }

  const [booking]: Booking[] = await getBookingById(id);
  if (!booking) {
    return <div className="p-4 text-center text-gray-600">Booking not found</div>;
  }

  const event: Event | null = await getEventById(booking.eventId);
  const currentPrice = event?.currentPrice ?? 0;

  const breakdown = booking.priceBreakdown.breakdown;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto mt-8">
      <h2 className="title">Booking Confirmed!!</h2>

      <div className="space-y-2 text-gray-800">
        <p>
          <span className="font-semibold">Booking ID:</span>{' '}
          <span className="font-mono">{booking.id}</span>
        </p>
        <p>
          <span className="font-semibold">Event:</span> {event?.name ?? 'N/A'}
        </p>
        <p>
          <span className="font-semibold">Tickets:</span> {booking.quantity}
        </p>
        <p>
          <span className="font-semibold">Price Paid:</span> ₹{booking.pricePaid}
        </p>
        <p className="text-sm text-gray-600">
          Current Price: ₹{currentPrice * booking.quantity}{' '}
          {currentPrice * booking.quantity > booking.pricePaid ? (
            <span className="text-red-500">(Price increased)</span>
          ) : currentPrice * booking.quantity < booking.pricePaid ? (
            <span className="text-green-600">(Price dropped)</span>
          ) : (
            <span className="text-gray-500">(Unchanged)</span>
          )}
        </p>
      </div>

      <div className="mt-6 border-t pt-4">
        <h3 className="title !mb-2">Price Breakdown</h3>
        <div className="space-y-1 text-sm text-gray-700">
          <p>
            Base Price: <span className="font-medium">₹{booking.priceBreakdown.basePrice}</span>
          </p>
          <p>
            Time Factor: +{breakdown.timePercentage}% (₹{breakdown.timeAmount.toFixed(2)})
          </p>
          <p>
            Demand Factor: +{breakdown.demandPercentage}% (₹{breakdown.demandAmount.toFixed(2)})
          </p>
          <p>
            Inventory Factor: +{breakdown.inventoryPercentage}% (₹{breakdown.inventoryAmount.toFixed(2)})
          </p>
          <p className="font-semibold mt-2">Final Price Paid: ₹{booking.pricePaid}</p>
        </div>
      </div>
    </div>
  );
}
