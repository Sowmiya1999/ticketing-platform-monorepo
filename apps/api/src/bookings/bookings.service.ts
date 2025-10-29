import { Injectable, Logger } from "@nestjs/common";
import { BookingDTO } from "./dto/createBooking.dto";
import { Booking } from "../database/schema";
import { BookingsRepository } from "../repositories/booking.repository";
import { GenericResponse } from "../lib/response/response";
import {
  CREATE_NEW_BOOKING_FAILED_MESSAGE,
  CREATE_NEW_BOOKING_SUCCESS_MESSAGE,
} from "../lib/common/constants";

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(private readonly bookingRepository: BookingsRepository) {}
  //method to get all the booking for an event
  async getBookingByEventId(eventId: number): Promise<Booking[]> {
    try {
      console.log(
        `BookingsService.getBookingByEventId called with eventId: ${eventId}`
      );
      return this.bookingRepository.getBookingByEventId(eventId);
    } catch (error) {
      console.error(
        `BookingsService.getBookingByEventId produced error: ${error}`
      );
      return [];
    }
  }

  async getBookingById(bookingId: number): Promise<Booking[]> {
    try {
      console.log(
        `BookingsService.getBookingById called with bookingId: ${bookingId}`
      );
      return this.bookingRepository.getBookingById(bookingId);
    } catch (error) {
      console.error(`BookingsService.getBookingById produced error: ${error}`);
      return [];
    }
  }
  async createBooking(bookingData: BookingDTO): Promise<GenericResponse> {
    try {
      this.logger.debug(
        `BookingService.createBooking Creating booking for data: ${JSON.stringify(bookingData)}`
      );

      const newBooking: Booking =
        await this.bookingRepository.createNewBooking(bookingData);

      this.logger.log(`Booking created successfully: ID ${newBooking.id}`);

      return { data: newBooking, message: CREATE_NEW_BOOKING_SUCCESS_MESSAGE };
    } catch (error) {
      this.logger.error(
        "BookingService.createBooking Booking creation failed",
        error
      );
      return {
        data: null,
        message: `${CREATE_NEW_BOOKING_FAILED_MESSAGE}:${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  async getBookingsByEmail(email: string): Promise<any[]> {
    return await this.bookingRepository.findBookingByEmail(email);
  }
}
