import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Event } from "../database/schema";
import { EventsRepository } from "../repositories/event.repository";
import { EventDTO } from "./dto/createEvent.dto";
import { mergePricingRules } from "../lib/helper/helper";
import { defaultPricingRules } from "../pricingEngine/common/constants";
import { PricingRules } from "../pricingEngine/type/pricingRules.type";
import { PriceBreakdown } from "../bookings/type/priceBreakdown.type";
import { PricingEngineService } from "../pricingEngine/pricingEngine.service";
import { PricingResult } from "./types/priceBreakdown.type";

@Injectable()
export class EventsService {
  constructor(
    private readonly eventRepository: EventsRepository,
    private readonly pricingEngineService: PricingEngineService,
    private readonly logger: Logger
  ) {}

  // method to get all the event info from db that is not in deleted status
  async getAllEventsData(): Promise<Event[]> {
    try {
      this.logger.log(`EventsService.getAllEventsData is called `);
      return this.eventRepository.findAllEvent();
    } catch (error) {
      this.logger.error(`EventsService.getAllEventsData produced error: ${error}`);
      return [];
    }
  }

  // method to get a single event's info based on provided eventId
  async getEventById(eventId: number): Promise<Event> {
    try {
      this.logger.log(
        `EventsService.getEventsById is called for eventId: ${eventId}`
      );
      const [event] = await this.eventRepository.findEventByIds([eventId]);
      return event || ({} as Event);
    } catch (error) {
      this.logger.error(`EventsService.getEventsById produced error: ${error}`);
      return {} as Event;
    }
  }

  // method to create new event with provided input data
  async createNewEvent(eventData: EventDTO): Promise<Event> {
    try {
      this.logger.log(
        `EventsService.createNewEvent is called for eventData: ${JSON.stringify(eventData)}`
      );

      this.logger.log(`EventsService.getFinalRules is called`);
      eventData.pricingRules = this.getFinalRules(
        eventData.isDefaultPricingRulesEnabled ?? true,
        eventData.pricingRules as any
      );

      this.logger.log(`EventRepository.createEvent is called`);
      const createdEvent = await this.eventRepository.createEvent(eventData);

      this.logger.log(`PricingEngineService.calculatePricing is called`);
      await this.pricingEngineService.calculatePricing();

      this.logger.log(`EventsService.createNewEvent completed successfully`);
      return createdEvent;
    } catch (error) {
      this.logger.error(`EventsService.createNewEvent produced error: ${error}`);
      return {} as Event;
    }
  }

  private getFinalRules(
    isDefaultPricingRulesEnabled: boolean,
    customerRules?: Partial<PricingRules>
  ): PricingRules {
    try{
    this.logger.log(`EventsService.getFinalRules is called`);
    // condition to priortize the customer preference over default
    //  and to check whether to include default pricing rules.
    if (!isDefaultPricingRulesEnabled) {
      this.logger.log(`EventsService.getFinalRules: Using custom pricing rules`);
      return mergePricingRules(
        {
          weights: { time: 1, demand: 1, inventory: 1 },
          timeRules: [],
          demandRules: [],
          inventoryRules: [],
        },
        customerRules ?? {}
      );
    }

    this.logger.log(`EventsService.getFinalRules: Merging default and custom pricing rules`);
    return mergePricingRules(defaultPricingRules, customerRules ?? {});
  } catch (error) {
    this.logger.error(`EventsService.getFinalRules produced error: ${error}`);
    return defaultPricingRules;
  }
}

  async calculatePriceBreakDown(
    eventId: number,
    quantity: number,
    priceBreakDown: PriceBreakdown
  ):Promise<PricingResult> {
    try{
    this.logger.log(`EventsService.calculatePriceBreakDown is called for eventId: ${eventId}, quantity: ${quantity}`);
    const {
      basePrice,
      timeAmount,
      timePercent,
      demandAmount,
      demandPercent,
      inventoryAmount,
      inventoryPercent,
    } = priceBreakDown;

    this.logger.log(`Calculating factors for price breakdown`);
    const timeAmountTotal = (timeAmount ?? 0) * quantity;
    const demandAmountTotal = (demandAmount ?? 0) * quantity;
    const inventoryAmountTotal = (inventoryAmount ?? 0) * quantity;

    this.logger.log(`Calculating total price paid`);
    const pricePaid =
     (basePrice * quantity)  +
      timeAmountTotal +
      demandAmountTotal +
      inventoryAmountTotal;

    this.logger.log(`Total price paid calculated: ${pricePaid}`);
    return {
      eventId,
      quantity,
      basePrice: basePrice * quantity,
      pricePaid: pricePaid,
      breakdown: {
        timePercentage: (timePercent).toFixed(2),
        timeAmount: timeAmountTotal,
        demandPercentage: (demandPercent),
        demandAmount: demandAmountTotal,
        inventoryPercentage: (inventoryPercent).toFixed(2) ?? 0,
        inventoryAmount: inventoryAmountTotal,
      },
    };
  } catch (error) {
    this.logger.error(`EventsService.calculatePriceBreakDown produced error: ${error}`);
    return {} as PricingResult;
  }
}
}
