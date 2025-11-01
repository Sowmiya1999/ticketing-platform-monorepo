import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { Event } from "../database/schema";
import { EventsService } from "./events.service";
import { EventDTO } from "./dto/createEvent.dto";
import { PricingEngineService } from "../pricingEngine/pricingEngine.service";
import { PriceBreakdown } from "../bookings/type/priceBreakdown.type";
import { PricingResult } from "./types/priceBreakdown.type";

/**
 * APIs:
- `GET /events` - List all events with current price and availability
- `GET /events/:id` - Get single event details with price breakdown
- `POST /events` - Create new event (simple auth is fine)
- `POST /events/:id/price-breakdown` - Calculate price breakdown for given quantity and options
 */

@Controller("events")
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly logger: Logger
  ) {}

  @Get()
  async getAllEvents(): Promise<Event[]> {
    this.logger.log("Getting all events");
    return await this.eventsService.getAllEventsData();
  }

  @Get(":id")
  async getEventById(@Param("id") eventId: number): Promise<Event | null> {
    this.logger.log(`Getting event by ID: ${eventId}`);
    return await this.eventsService.getEventById(eventId);
  }

  /**
   * API to create a new event
   * @param eventData
   * @returns
   */

  @Post()
  async createEvent(@Body() eventData: EventDTO): Promise<Event | null> {
    this.logger.log("Creating new event");
    return this.eventsService.createNewEvent(eventData);
  }

  @Post(":id/price-breakdown")
  async getEventPriceBreakDown(
    @Param("id") id: number,
    @Body() body: { quantity: number; priceBreakDown: PriceBreakdown }
  ):Promise<PricingResult> {
    this.logger.log(`Calculating price breakdown for event ID: ${id}`);
    return this.eventsService.calculatePriceBreakDown(
      id,
      body.quantity,
      body.priceBreakDown
    );
  }
}
