import { Module } from '@nestjs/common';
import { PricingEngineService } from './pricingEngine.service';
import { EventsRepository } from '../repositories/event.repository';
import { BookingsRepository } from '../repositories/booking.repository';
import { EventsService } from '../events/events.service';

@Module({
    providers: [PricingEngineService, EventsRepository,BookingsRepository, EventsService],
    exports:[PricingEngineService]

})
export class PricingEngineModule {}
