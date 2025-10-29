import { Injectable, NotFoundException } from "@nestjs/common";
import { Event } from "../database/schema";
import { EventsRepository } from "../repositories/event.repository";
import { EventDTO } from "./dto/createEvent.dto";
import { mergePricingRules } from "../lib/helper/helper";
import { defaultPricingRules } from "../pricingEngine/common/constants";
import { PricingRules } from "../pricingEngine/type/pricingRules.type";
import { PriceBreakdown } from "../bookings/type/priceBreakdown.type";
import { PricingEngineService } from "../pricingEngine/pricingEngine.service";

@Injectable()
export class EventsService {
  constructor(
    private readonly eventRepository: EventsRepository,
    private readonly pricingEngineService: PricingEngineService
  ) {}

  // method to get all the event info from db that is not in deleted status
  async getAllEventsData(): Promise<Event[]> {
    try {
      console.log(`EventsService.getAllEventsData is called `);
      return this.eventRepository.findAllEvent();
    } catch (error) {
      console.error(`EventsService.getAllEventsData produced error: ${error}`);
      return [];
    }
  }

  // method to get a single event's info based on provided eventId
  async getEventById(eventId: number): Promise<Event> {
    try {
      console.log(
        `EventsService.getEventsById is called for eventId: ${eventId}`
      );
      const [event] = await this.eventRepository.findEventByIds([eventId]);
      return event || ({} as Event);
    } catch (error) {
      console.error(`EventsService.getEventsById produced error: ${error}`);
      return {} as Event;
    }
  }

  // method to create new event with provided input data
  async createNewEvent(eventData: EventDTO): Promise<Event> {
    try {
      console.log(
        `EventsService.createNewEvent is called for eventData: ${JSON.stringify(eventData)}`
      );

      eventData.pricingRules = this.getFinalRules(
        eventData.isDefaultPricingRulesEnabled ?? true,
        eventData.pricingRules as any
      );

      const createdEvent = await this.eventRepository.createEvent(eventData);
      await this.pricingEngineService.calculatePricing();
      return createdEvent;
    } catch (error) {
      console.error(`EventsService.createNewEvent produced error: ${error}`);
      return {} as Event;
    }
  }

  private getFinalRules(
    isDefaultPricingRulesEnabled: boolean,
    customerRules?: Partial<PricingRules>
  ): PricingRules {
    // condition to priortize the customer preference over default
    //  and to check whether to include default pricing rules.
    if (!isDefaultPricingRulesEnabled) {
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

    return mergePricingRules(defaultPricingRules, customerRules ?? {});
  }

  async calculatePriceBreakDown(
    eventId: number,
    quantity: number,
    priceBreakDown: PriceBreakdown
  ) {
    const {
      basePrice,
      timeAmount,
      timePercent,
      demandAmount,
      demandPercent,
      inventoryAmount,
      inventoryPercent,
    } = priceBreakDown;

    const timeAmountTotal = (timeAmount ?? 0) * quantity;
    const demandAmountTotal = (demandAmount ?? 0) * quantity;
    const inventoryAmountTotal = (inventoryAmount ?? 0) * quantity;

    const pricePaid =
      basePrice * quantity +
      timeAmountTotal +
      demandAmountTotal +
      inventoryAmountTotal;

    return {
      eventId,
      quantity,
      basePrice: basePrice * quantity,
      pricePaid: pricePaid,
      breakdown: {
        timePercentage: timePercent,
        timeAmount: timeAmountTotal,
        demandPercentage: demandPercent,
        demandAmount: demandAmountTotal,
        inventoryPercentage: inventoryPercent ?? 0,
        inventoryAmount: inventoryAmountTotal,
      },
    };
  }
}
