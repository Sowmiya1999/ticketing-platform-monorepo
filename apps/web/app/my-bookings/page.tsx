'use client';

import React, { useState, useCallback } from 'react';
import { getUserBookings } from '../../lib/clientApi';

export default function MyBookingsPage() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setBookings([]);
      try {
        const data = await getUserBookings(email);
        setBookings(data);
        setSubmitted(true);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    },
    [email]
  );

  return (
    <section className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-6">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/20 cursor-not-allowed">
          <div className="w-16 h-16 border-4 border-transparent border-t-blue-600 border-r-orange-400 rounded-full animate-spin"></div>
        </div>
      )}

      <h2 className="title">My Bookings</h2>

      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-3">
        <div className="relative w-full max-w-sm rounded p-[2px] bg-gradient-to-r from-blue-600 to-orange-400">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full p-2 rounded bg-white border-none focus:outline-none focus:ring-2 focus:ring-transparent"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-orange-400 text-white font-medium hover:opacity-90 transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Fetching...' : 'Find My Bookings'}
          </button>
        </div>
      </form>

      {error && <p className="text-red-600 text-center">{error}</p>}

      {submitted && bookings.length === 0 && !loading && (
        <p className="text-center text-gray-600">No bookings found for {email}</p>
      )}

      {bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((b) => {
            let message = '';
            let messageColor = '';

            if (b.currentPrice && b.pricePaid) {
              const diff = b.currentPrice * b.quantity - b.pricePaid;
              if (diff > 0) {
                message = `You saved ${formatPrice(diff)}`;
                messageColor = 'text-green-600';
              } else if (diff < 0) {
                message = `You lost ${formatPrice(Math.abs(diff))}`;
                messageColor = 'text-red-600';
              } else {
                message = 'No change';
                messageColor = 'text-gray-600';
              }
            }

            return (
              <div
                key={b.id}
                className="p-[2px] rounded-lg bg-gradient-to-r from-blue-600 to-orange-400"
              >
                <div className="bg-white rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-900">{b.eventName}</div>
                    <div className="font-medium text-gray-900">
                      Booked at: {b.eventDate}
                    </div>
                    <div className="text-sm text-gray-600">
                      Booked Tickets: {b.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      Paid: {formatPrice(b.pricePaid)}
                    </div>
                    {b.currentPrice && (
                      <div className="text-sm text-gray-500">
                        Current: {formatPrice(b.currentPrice * b.quantity)}
                      </div>
                    )}
                    {message && (
                      <div className={`text-sm font-medium ${messageColor}`}>
                        {message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
