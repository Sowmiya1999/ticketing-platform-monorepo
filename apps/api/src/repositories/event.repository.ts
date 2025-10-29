import { Injectable } from "@nestjs/common";
import { Event } from "../database/schema";
import { db } from "../database";
import { events } from "../database/schema";
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

  async updatePriceBreakDown(eventId:number, newPrice:number, priceBreakDown:any):Promise<void>{
     await db.update(events).set({currentPrice:newPrice, priceBreakDown: priceBreakDown}).where(eq(events.id,eventId));
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
      isDefaultPricingRulesEnabled
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
        isDefaultPricingRulesEnabled
      })
      .returning();

    return {} as Event;

  }

}
