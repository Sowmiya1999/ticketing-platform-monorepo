import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventsRepository } from '../repositories/event.repository';
import { PricingEngineService } from '../pricingEngine/pricingEngine.service';
import { BookingsRepository } from '../repositories/booking.repository';
import { AdminAuthMiddleware } from '../pricingEngine/common/middleware/auth.middleware';

@Module({
    controllers: [EventsController],
    providers: [EventsService, EventsRepository,PricingEngineService,BookingsRepository,Logger],
    exports: [EventsService,EventsRepository],
})
export class EventsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminAuthMiddleware)
     .forRoutes({ path: 'events', method: RequestMethod.POST });

  }
}
