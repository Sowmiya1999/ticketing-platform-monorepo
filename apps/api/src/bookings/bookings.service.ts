import { Injectable } from "@nestjs/common";
import { BookingDTO } from "./dto/createBooking.dto";
import { Booking } from "../database/schema";
import { BookingsRepository } from "../repositories/booking.repository";

@Injectable()
export class BookingsService {

    constructor(
        private readonly bookingRepository:BookingsRepository
    ){}
  //method to get all the booking for an event
  async getBookingByEventId(eventId: number): Promise<Booking[]> {
    try {
      console.log(
        `BookingsService.getBookingByEventId called with eventId: ${eventId}`
      );
      return this.bookingRepository.getBookingByEventId(eventId);
    } catch (error) {
      console.error(`BookingsService.getBookingByEventId produced error: ${error}`);
      return [];
    }
  }
  async createBooking(bookingData: BookingDTO): Promise<Booking> {
    try {
      console.log(
        `BookingsService.createBooking called with bookingData: ${JSON.stringify(bookingData)}`
      );
      bookingData["pricePaid"] = 1000;
      return this.bookingRepository.createNewBooking(bookingData);
    } catch (error) {
      console.error(`BookingsService.createBooking produced error: ${error}`);
      return {} as Booking;
    }
  }
}
