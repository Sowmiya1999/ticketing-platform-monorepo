import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { Booking } from "../database/schema";
import { BookingDTO } from "./dto/createBooking.dto";
import { GenericResponse } from "../lib/response/response";
import { BookingWithEvent } from "../repositories/types/bookingWithEvent.type";

/**
 * APIs:
 * - `GET /bookings?eventId=` - Get all bookings for an event
 * - `GET /bookings/:bookingId` - Get booking details by booking ID
 * - `POST /bookings` - Create a new booking
 * - `GET /bookings/by-email/:email` - Get bookings by user email
 */

@Controller("bookings")
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly logger: Logger
  ) {}


  @Get()
  async getBookingByEventId(
    @Query("eventId") eventId: number
  ): Promise<Booking[]> {
    this.logger.log(`bookingsService.getBookingByEventId called`);
    return this.bookingsService.getBookingByEventId(Number(eventId));
  }


  @Get(":bookingId")
  async getBookingByBookingId(
    @Param("bookingId") bookingId: number
  ): Promise<Booking[]> {
    this.logger.log(`bookingsService.getBookingByEventId called`);
    return this.bookingsService.getBookingById(Number(bookingId));
  }



  @Post()
  async createBooking(
    @Body() bookingData: BookingDTO
  ): Promise<GenericResponse> {
    this.logger.log(`bookingsService.createBooking called`);
    return this.bookingsService.createBooking(bookingData);
  }


  @Get("by-email/:email")
  async getBookingsByEmail(@Param("email") email: string): Promise<BookingWithEvent[]> {
    this.logger.log(`bookingsService.getBookingsByEmail called`);
    return this.bookingsService.getBookingsByEmail(email);
  }
}
