import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from '../database/schema';
import { BookingDTO } from './dto/createBooking.dto';



@Controller('bookings')
export class BookingsController {

     constructor(private readonly bookingsService: BookingsService) {
         console.log('BookingsService injected:', bookingsService);
      }
    
      /**
       * API to get the booking data by event id
       * @queryParam eventId
       * @returns booking data for the event
       */
      @Get()
      async getBookingByEventId(@Query("eventId") eventId: number): Promise<Booking[]> {
        return this.bookingsService.getBookingByEventId(eventId);
      }
    
      /**
       * API to create a new booking
       * @param bookingData
       * @returns
       */
    
      @Post()
      async createBookings(@Body() bookingData: BookingDTO): Promise<Booking | null> {
        return this.bookingsService.createBooking(bookingData);
      }
}
