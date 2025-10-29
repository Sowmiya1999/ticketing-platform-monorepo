import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingsRepository } from '../repositories/booking.repository';
import { EventsRepository } from '../repositories/event.repository';

@Module({
  providers: [BookingsService, BookingsRepository,EventsRepository],
  controllers: [BookingsController],
  exports:[BookingsRepository,BookingsService]
})
export class BookingsModule {}
