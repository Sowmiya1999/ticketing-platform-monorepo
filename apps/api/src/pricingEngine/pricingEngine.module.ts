import { Module } from '@nestjs/common';
import { PricingEngineService } from './pricingEngine.service';
import { EventsRepository } from '../repositories/event.repository';
import { BookingsRepository } from '../repositories/booking.repository';

@Module({
    providers: [PricingEngineService, EventsRepository,BookingsRepository],
    exports:[PricingEngineService]

})
export class PricingEngineModule {}
