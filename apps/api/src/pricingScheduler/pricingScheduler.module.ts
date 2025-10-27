import { Module } from '@nestjs/common';
import { PriceSchedulerService } from '../pricingScheduler/pricingSchedulerService';
import { PricingEngineService } from '../pricingEngine/pricingEngine.service';
import { EventsRepository } from '../repositories/event.repository';
import { BookingsRepository } from '../repositories/booking.repository';

@Module({
    providers: [ PriceSchedulerService,PricingEngineService,EventsRepository,BookingsRepository],
})
export class PricingSchedulerModule {}
