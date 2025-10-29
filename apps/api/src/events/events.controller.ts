import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Event } from "../database/schema";
import { EventsService } from "./events.service";
import { EventDTO } from "./dto/createEvent.dto";
import { PricingEngineService } from "../pricingEngine/pricingEngine.service";
import { PriceBreakdown } from "../bookings/type/priceBreakdown.type";

/**
- `GET /events` - List all events with current price and availability
- `GET /events/:id` - Get single event details with price breakdown
- `POST /events` - Create new event (simple auth is fine)
 */



@Controller("events")
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly pricingEngineService: PricingEngineService

  ) {
     console.log('EventsService injected:', eventsService);
  }

  /**
   * API to get allpricingEngine data
   */
  @Get()
  async getAllEvents(): Promise<Event[]> {
     console.log('EventsService injected here:', this.eventsService);
    return await this.eventsService.getAllEventsData();
  }

  /**
   * API to get the event data by event id
   * @param id
   * @returns event data
   */
  @Get(":id")
  async getEventById(@Param("id") eventId: number): Promise<Event | null> {
    return await this.eventsService.getEventById(eventId);
  }

  /**
   * API to create a new event
   * @param eventData
   * @returns
   */

  @Post()
  async createEvent(@Body() eventData: EventDTO): Promise<Event | null> {
    return this.eventsService.createNewEvent(eventData);
  }

@Post(':id/price-breakdown')
async getEventPriceBreakDown(
  @Param('id') id: number,
  @Body() body: { quantity: number; priceBreakDown: PriceBreakdown }
) {
  return this.eventsService.calculatePriceBreakDown(id, body.quantity, body.priceBreakDown);
}
   
}
