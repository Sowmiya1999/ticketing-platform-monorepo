import { Injectable } from "@nestjs/common";
import { Event } from "../database/schema";
import { EventsRepository } from "../repositories/event.repository";
import { PricingRules } from "./type/pricingRules.type";
import { mergePricingRules } from "../lib/helper/helper";
import { defaultPricingRules } from "./common/constants";
import { differenceInDays } from "date-fns";
import { BookingsRepository } from "../repositories/booking.repository";

@Injectable()
export class PricingEngineService {
  constructor(
    private readonly eventsRepository: EventsRepository,
    private readonly bookingsRepository: BookingsRepository
  ) {}

  async calculatePricing() {
    const eventDetails: Event[] = await this.eventsRepository.getActiveEvents();
    for (const event of eventDetails) {
      const {
        id,
        basePrice,
        totalTickets,
        bookedTickets,
        date,
        floorPrice,
        ceilingPrice,
        pricingRules,
        isDefaultPricingRulesEnabled,
      }: Partial<Event> = event;

      const rules = this.getFinalRules(
        isDefaultPricingRulesEnabled ?? true,
        pricingRules as any
      );

      const daysLeftForEvent = Math.max(0, differenceInDays(date, new Date()));

      const remainingTicketsRatio: number =
        (totalTickets - bookedTickets!) / totalTickets;

      const recentBookings: number =
        await this.bookingsRepository.getBookingInLastProvidedHours(
          parseInt(process.env.THRESHOLD_TIME_FOR_DEMANDS!),
          id
        );

      // Time based rule
      const timeAdjustment = this.getTimeAdjustment(
        daysLeftForEvent,
        rules.timeRules
      );

      // Inventory based rule
      const inventoryAdjustment = this.getInventoryAdjustment(
        remainingTicketsRatio,
        rules.inventoryRules
      );

      // Demand Based rule
      const demandAdjustment = this.getDemandAdjustment(
        recentBookings,
        rules.demandRules
      );

      const totalAdjustment =
        timeAdjustment * rules.weights.time +
        demandAdjustment * rules.weights.demand +
        inventoryAdjustment * rules.weights.inventory;

      let newPrice = basePrice * (1 + totalAdjustment);

      newPrice = Math.max(floorPrice, Math.min(ceilingPrice, newPrice));
      
      if (newPrice !== event.currentPrice) {
        await this.eventsRepository.updatePrice(id, newPrice);
      }
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
          weights: { time: 0, demand: 0, inventory: 0 },
          timeRules: [],
          demandRules: [],
          inventoryRules: [],
        },
        customerRules ?? {}
      );
    }

    return mergePricingRules(defaultPricingRules, customerRules ?? {});
  }

  private getTimeAdjustment(
    daysBefore: number,
    timeRules: { daysBefore: number; weight: number }[]
  ): number {
    const rule = timeRules
      .sort((a, b) => a.daysBefore - b.daysBefore)
      .find((r) => daysBefore <= r.daysBefore);

    return rule ? rule.weight : 0;
  }

  private getDemandAdjustment(
    recentBookings: number,
    demandRules: { threshold: number; boost: number }[]
  ): number {
    const rule = demandRules
      .sort((a, b) => b.threshold - a.threshold)
      .find((r) => recentBookings >= r.threshold);

    return rule ? rule.boost : 0;
  }
  private getInventoryAdjustment(
    inventoryLeftRatio: number,
    inventoryRules: { threshold: number; boost: number }[]
  ): number {
    const rule = inventoryRules
      .sort((a, b) => a.threshold - b.threshold)
      .find((r) => inventoryLeftRatio <= r.threshold);

    return rule ? rule.boost : 0;
  }
}
