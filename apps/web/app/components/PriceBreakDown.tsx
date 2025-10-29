"use client";
import React, { useEffect, useState } from "react";
export default function PriceBreakdown({
  eventId,
  quantity,
  priceBreakdown,
  basePrice,
  serverCurrentPrice,
}: any) {
  const [currentPrice, setCurrentPrice] = useState<number>(serverCurrentPrice);
  const [breakdown, setBreakdown] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (!mounted) return;

        setCurrentPrice(serverCurrentPrice);
        setBreakdown(priceBreakdown);
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to fetch price breakdown");
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
  }, [eventId, quantity, priceBreakdown]);

  if (loading && !breakdown) return <div>Loading price breakdown...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!breakdown) return null;
  {
    console.log(breakdown);
  }
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <div>Base price</div>
        <div>₹{(basePrice * quantity)?.toFixed(2) ?? "—"}</div>
      </div>

      <div className="border-t" />

      {breakdown.timeAmount !== undefined && (
        <div className="flex justify-between text-sm">
          <div>Time-based Adjustment</div>
          <div>
            {breakdown.timeAmount >= 0 ? "+" : ""}₹
            {Math.abs(breakdown.timeAmount).toFixed(2)}
          </div>
        </div>
      )}

      {breakdown.demandAmount !== undefined && (
        <div className="flex justify-between text-sm">
          <div>Demand-based Adjustment</div>
          <div>
            {breakdown.demandAmount >= 0 ? "+" : ""}₹
            {Math.abs(breakdown.demandAmount).toFixed(2)}
          </div>
        </div>
      )}

      {breakdown.inventoryAmount !== undefined && (
        <div className="flex justify-between text-sm">
          <div>Inventory-based Adjustment</div>
          <div>
            {breakdown.inventoryAmount >= 0 ? "+" : ""}₹
            {Math.abs(breakdown.inventoryAmount).toFixed(2)}
          </div>
        </div>
      )}

      <div className="border-t" />

      <div className="flex justify-between font-semibold">
        <div>Current Price</div>
        <div>₹{(currentPrice * quantity).toFixed(2)}</div>
      </div>
    </div>
  );
}
