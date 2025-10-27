import { Injectable, Logger } from "@nestjs/common";
import { EventsRepository } from "../repositories/event.repository";
import { BookingsRepository } from "../repositories/booking.repository";
import { PricingEngineService } from "../pricingEngine/pricingEngine.service";
import { Cron, CronExpression, Interval } from '@nestjs/schedule';

@Injectable()
export class PriceSchedulerService {
  private readonly logger = new Logger(PriceSchedulerService.name);

  constructor(
    private readonly pricingEngineService: PricingEngineService,
  ) {}

  @Interval(30_000)
  async updateEventPrices(){
    console.log("schedulerService is running");
    await this.pricingEngineService.calculatePricing()
  }
}