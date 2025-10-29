import {  Injectable } from "@nestjs/common";
import { Event } from "../database/schema";
import { EventsRepository } from "../repositories/event.repository";
import { convertJson } from "../lib/helper/helper";
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
        currentPrice
      }: Partial<Event> = event;

      const rules: any = convertJson(pricingRules);

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
        rules.timeRules!
      );

      // Inventory based rule
      const inventoryAdjustment = this.getInventoryAdjustment(
        remainingTicketsRatio,
        rules.inventoryRules!
      );

      // Demand Based rule
      const demandAdjustment = this.getDemandAdjustment(
        recentBookings,
        rules.demandRules!
      );

      const priceAdjustment = this.getTotalAdjustment(
        basePrice,
        rules,
        timeAdjustment,
        demandAdjustment,
        inventoryAdjustment
      );

     
      let newPrice = basePrice * (1 + priceAdjustment.totalAdjustment);

      newPrice = Math.max(floorPrice, Math.min(ceilingPrice, newPrice));

      if (newPrice !== event.currentPrice) {
        await this.eventsRepository.updatePriceBreakDown(id, newPrice, priceAdjustment)
      }
    }
  }

  private getTotalAdjustment(
  basePrice: number,
  rules: any,
  timeAdjustment: number,
  demandAdjustment: number,
  inventoryAdjustment: number
) {
  const timePercent = timeAdjustment * rules.weights!.time;
  const demandPercent = demandAdjustment * rules.weights!.demand;
  const inventoryPercent = inventoryAdjustment * rules.weights!.inventory;

  let totalAdjustment = timePercent + demandPercent + inventoryPercent;


  const timeAmount = basePrice * timePercent;
  const demandAmount = basePrice * demandPercent;
  const inventoryAmount = basePrice * inventoryPercent;

  return {
    basePrice,
    timePercent,
    timeAmount,
    demandPercent,
    demandAmount,
    inventoryPercent,
    inventoryAmount,
    totalAdjustment,
  };
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
    demandRules: { threshold: number; weight: number }[]
  ): number {
    const rule = demandRules
      .sort((a, b) => b.threshold - a.threshold)
      .find((r) => recentBookings >= r.threshold);

    return rule ? rule.weight : 0;
  }
  private getInventoryAdjustment(
    inventoryLeftRatio: number,
    inventoryRules: { threshold: number; weight: number }[]
  ): number {
    const rule = inventoryRules
      .sort((a, b) => a.threshold - b.threshold)
      .find((r) => inventoryLeftRatio <= r.threshold);

    return rule ? rule.weight : 0;
  }
}
