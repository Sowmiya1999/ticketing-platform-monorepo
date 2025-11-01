

export async function getUpcomingEvents() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}
export async function getEventById(id: string | number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${Number(id)}`,
  { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Event not found");
  return res.json();
}

export async function getBookingById(bookingId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/${bookingId}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Booking not found");
  return res.json();
}

export interface EventDTO {
  name: string;
  venue: string;
  date: string;
  description: string;
  totalTickets: number;
  basePrice: number;
  floorPrice: number;
  ceilingPrice: number;
  isDefaultPricingRulesEnabled: boolean;
}

export async function createEvent(eventData: EventDTO) {
  const apiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || "";

  if (!apiKey) {
    console.warn("Missing ADMIN_API_KEY in environment variables");
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/events`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      } as HeadersInit,
      body: JSON.stringify(eventData),
    }
  );

  if (!response.ok) {
    let errorText = "Failed to create event";
    try {
      const error = await response.json();
      errorText = error.message || errorText;
    } catch (_) {}
    throw new Error(errorText);
  }

  return response.json();
}
