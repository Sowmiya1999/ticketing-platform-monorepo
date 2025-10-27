import { Injectable } from "@nestjs/common";
import { BookingDTO } from "../bookings/dto/createBooking.dto";
import { Booking, bookings } from "../database/schema";
import { db } from "../database";
import { and, eq, sql } from "drizzle-orm";
import { Status } from "../lib/common/enum";

@Injectable()
export class BookingsRepository {
  constructor() {}

  async getBookingByEventId(eventId:number):Promise<Booking[]>{
   return await db.select().from(bookings).where(and(eq(bookings.eventId,eventId), eq(bookings.status,Status.ACTIVE)) );

  }
  async createNewBooking(bookingData:BookingDTO):Promise<Booking>{
     const [booking] = await db.insert(bookings).values({eventId:bookingData.eventId, userEmail:bookingData.userEmail, quantity:bookingData.quantity, pricePaid:bookingData.pricePaid}).returning();
     return booking ?? {} as Booking;

  }

  async getBookingInLastProvidedHours(hourToGetDataFor:number, eventId:number):Promise<number>{
     const hourAgo = new Date(Date.now() - hourToGetDataFor * 60 * 60 * 1000);

    const countResult= await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(bookings)
      .where(sql`"event_id" = ${eventId} AND "created_at" > ${hourAgo.toISOString()}`);
    return countResult.length > 0 ? Number(countResult[0]?.count) : 0;

  }
}