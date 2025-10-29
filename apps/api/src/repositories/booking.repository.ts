import { Injectable } from "@nestjs/common";
import { BookingDTO } from "../bookings/dto/createBooking.dto";
import { Booking, bookings, events } from "../database/schema";
import { db } from "../database";
import { and, eq, ne, sql } from "drizzle-orm";
import { Status } from "../lib/common/enum";

@Injectable()
export class BookingsRepository {
  constructor() {}

  async getBookingByEventId(eventId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(
        and(eq(bookings.eventId, eventId), eq(bookings.status, Status.ACTIVE))
      );
  }
  async getBookingById(bookingId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(
        and(eq(bookings.id, bookingId), eq(bookings.status, Status.ACTIVE))
      );
  }
  async createNewBooking(bookingData: BookingDTO): Promise<Booking> {
  return await db.transaction(async (transac) => {
    const [event] = await transac
      .select()
      .from(events)
      .where(eq(events.id, bookingData.eventId))
      .for("update");

    if (!event) throw new Error("Event not found");

    const availableTickets =
      (event.totalTickets ?? 0) - (event.bookedTickets ?? 0);

    if (availableTickets < bookingData.quantity) {
      throw new Error("Not enough tickets available");
    }

    await transac
      .update(events)
      .set({
        bookedTickets: sql`${events.bookedTickets} + ${bookingData.quantity}`,
      })
      .where(eq(events.id, bookingData.eventId));

    const [newBooking] = await transac
      .insert(bookings)
      .values({
        eventId: bookingData.eventId,
        userEmail: bookingData.userEmail,
        quantity: bookingData.quantity,
        pricePaid: bookingData.priceBreakdown.pricePaid,
        priceBreakdown: bookingData.priceBreakdown
      })
      .returning();

    if (!newBooking) throw new Error("Failed to create bookinnewB");

    return newBooking;
  });
}

  async getBookingInLastProvidedHours(
    hourToGetDataFor: number,
    eventId: number
  ): Promise<number> {
    const hourAgo = new Date(Date.now() - hourToGetDataFor * 60 * 60 * 1000);

    const countResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(bookings)
      .where(
        sql`"event_id" = ${eventId} AND "created_at" > ${hourAgo.toISOString()}`
      );
    return countResult.length > 0 ? Number(countResult[0]?.count) : 0;
  }

  async  findBookingByEmail(email: string) {
  const results = await db
    .select({
      bookingId: bookings.id,
      userEmail: bookings.userEmail,
      quantity: bookings.quantity,
      pricePaid: bookings.pricePaid,
      priceBreakdown: bookings.priceBreakdown,
      status: bookings.status,
      createdAt: bookings.createdAt,
      eventId: events.id,
      eventName: events.name,
      eventVenue: events.venue,
      eventDate: events.date,
      currentPrice: events.currentPrice,
      basePrice: events.basePrice,
    })
    .from(bookings)
    .innerJoin(events, eq(bookings.eventId, events.id))
    .where(and(eq(bookings.userEmail, email), ne(bookings.status, Status.DELETED)));

    return results;
}
}
