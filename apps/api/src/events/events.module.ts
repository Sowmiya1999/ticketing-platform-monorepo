import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventsRepository } from '../repositories/event.repository';

@Module({
    controllers: [EventsController],
    providers: [EventsService, EventsRepository],
    exports: [EventsService,EventsRepository],
})
export class EventsModule {}
