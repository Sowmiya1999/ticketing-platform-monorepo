import { Module } from '@nestjs/common';
import { PriceSchedulerService } from '../pricingScheduler/pricingSchedulerService';
import { PricingEngineService } from '../pricingEngine/pricingEngine.service';
import { EventsRepository } from '../repositories/event.repository';
import { BookingsRepository } from '../repositories/booking.repository';
import { EventsService } from '../events/events.service';

@Module({
    providers: [ PriceSchedulerService,PricingEngineService,EventsRepository,BookingsRepository, EventsService],
})
export class PricingSchedulerModule {}
