import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from '../database/schema';
import { BookingDTO } from './dto/createBooking.dto';
import { GenericResponse } from '../lib/response/response';



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
        return this.bookingsService.getBookingByEventId(Number(eventId));
      }
      @Get(":bookingId")
      async getBookingByBookingId(@Param("bookingId")  bookingId: number): Promise<Booking[]> {
        return this.bookingsService.getBookingById(Number(bookingId));
      }
    
      /**
       * API to create a new booking
       * @param bookingData
       * @returns
       */
    
      @Post()
      async createBookings(@Body() bookingData: BookingDTO): Promise<GenericResponse> {
        return this.bookingsService.createBooking(bookingData);
      }

      @Get('by-email/:email')
async getBookingsByEmail(@Param('email') email: string): Promise<Booking[]> {
  return this.bookingsService.getBookingsByEmail(email);
}
}
