import { PriceBreakdown } from "../../bookings/type/priceBreakdown.type";

export type BookingWithEvent = {
  bookingId: number;
  userEmail: string;
  quantity: number;
  pricePaid: number;
  priceBreakdown: PriceBreakdown; 
  status: string;
  createdAt: Date;
  eventId: number;
  eventName: string;
  eventVenue: string;
  eventDate: Date;
  currentPrice: number;
  basePrice: number;
};
