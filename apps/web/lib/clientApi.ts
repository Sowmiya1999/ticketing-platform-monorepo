
export async function fetchPriceBreakdown(eventId: string,quantity:number, priceBreakDown:any) {
const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}/price-breakdown`,{
      method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({quantity,priceBreakDown}),
})
if (!res.ok) throw new Error('Breakdown fetch failed')
  return await res.json();
}

export async function createBooking(bookingData: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });

  if (!res.ok) throw new Error('Booking creation failed');
  return await res.json();
}

export async function getUserBookings(email: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/by-email/${email}`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}
