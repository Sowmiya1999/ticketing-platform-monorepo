'use client';
import React, { useEffect, useState } from 'react';

type PriceBreakdownData = {
  timeAmount?: number;
  demandAmount?: number;
  inventoryAmount?: number;
};

interface PriceBreakdownProps {
  eventId: number;
  quantity: number;
  basePrice: number;
  serverCurrentPrice: number;
  priceBreakdown: PriceBreakdownData;
}

export default function PriceBreakdown({
  eventId,
  quantity,
  priceBreakdown: initialBreakdown,
  basePrice,
  serverCurrentPrice,
}: PriceBreakdownProps) {
  const [currentPrice, setCurrentPrice] = useState<number>(serverCurrentPrice);
  const [breakdown, setBreakdown] = useState<PriceBreakdownData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (!mounted) return;

        setCurrentPrice(serverCurrentPrice);
        setBreakdown(initialBreakdown);
      } catch (err: unknown) {
        if (mounted) setError(err instanceof Error ? err.message : 'Failed to fetch price breakdown');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [eventId, quantity, serverCurrentPrice, initialBreakdown]);

  if (loading && !breakdown) return <div>Loading price breakdown...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!breakdown) return null;

  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <div>Base price</div>
        <div>{formatPrice(basePrice * quantity)}</div>
      </div>

      <div className="border-t" />

      {breakdown.timeAmount !== undefined && (
        <div className="flex justify-between text-sm">
          <div>Time-based Adjustment</div>
          <div>
            {breakdown.timeAmount >= 0 ? '+' : ''}
            {formatPrice(Math.abs(breakdown.timeAmount))}
          </div>
        </div>
      )}

      {breakdown.demandAmount !== undefined && (
        <div className="flex justify-between text-sm">
          <div>Demand-based Adjustment</div>
          <div>
            {breakdown.demandAmount >= 0 ? '+' : ''}
            {formatPrice(Math.abs(breakdown.demandAmount))}
          </div>
        </div>
      )}

      {breakdown.inventoryAmount !== undefined && (
        <div className="flex justify-between text-sm">
          <div>Inventory-based Adjustment</div>
          <div>
            {breakdown.inventoryAmount >= 0 ? '+' : ''}
            {formatPrice(Math.abs(breakdown.inventoryAmount))}
          </div>
        </div>
      )}

      <div className="border-t" />

      <div className="flex justify-between font-semibold">
        <div>Current Price</div>
        <div>{formatPrice(currentPrice * quantity)}</div>
      </div>
    </div>
  );
}
