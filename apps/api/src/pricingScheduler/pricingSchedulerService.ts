import { Injectable, Logger } from "@nestjs/common";
import { PricingEngineService } from "../pricingEngine/pricingEngine.service";
import {  Interval } from '@nestjs/schedule';

@Injectable()
export class PriceSchedulerService {

  constructor(
    private readonly pricingEngineService: PricingEngineService,
     private readonly logger:Logger
  ) {}

  @Interval(Number(process.env.SCHEDULER_INTERVAl) || 30_000)
  async updateEventPrices(){
    this.logger.log("schedulerService is running");
    await this.pricingEngineService.calculatePricing()
  }
}