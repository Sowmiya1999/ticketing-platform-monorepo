import { Injectable } from "@nestjs/common";
import { Event } from "../database/schema";
import { db } from "../database";
import { events, bookings } from "../database/schema";
import { Status } from "../lib/common/enum";
import { eq, ne, desc, inArray } from "drizzle-orm";
import { EventDTO } from "../events/dto/createEvent.dto";

@Injectable()
export class EventsRepository {
  constructor() {}

  async findAllEvent(): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .where(ne(events.status, Status.DELETED))
      .orderBy(desc(events.createdAt));
  }

  async getActiveEvents(): Promise<Event[]> {
   return await db
      .select()
      .from(events)
      .where(eq(events.status, Status.ACTIVE))
      .orderBy(desc(events.createdAt));
     
  }

  async findEventByIds(eventIds: number[]): Promise<Event[]> {
  return await db
      .select()
      .from(events)
      .where(inArray(events.id, eventIds));

  }

  async updatePrice(eventId:number, newPrice:number):Promise<void>{
     await db.update(events).set({currentPrice:newPrice}).where(eq(events.id,eventId));
     return;
  }

  async createEvent(eventData: EventDTO): Promise<Event> {
    const {
      name,
      venue,
      date,
      description,
      totalTickets,
      basePrice,
      floorPrice,
      ceilingPrice,
      pricingRules,
    } = eventData;
    await db
      .insert(events)
      .values({
        name,
        venue,
        date: new Date(date).toISOString().split("T")[0]|| "",
        description,
        totalTickets:totalTickets,
        basePrice:basePrice,
        currentPrice: basePrice,
        ceilingPrice: ceilingPrice,
        floorPrice:floorPrice,
        pricingRules: pricingRules ?? {},
        status: "ACTIVE",
      })
      .returning();

    return {} as Event;
  }
}
