import { Injectable, Logger } from '@nestjs/common';
import { EventsRepository } from '../repositories/event.repository';
import { BookingsRepository } from '../repositories/booking.repository';
import { Booking } from '../database/schema';

@Injectable()
export class AnalyticsService {
    constructor(
    private readonly eventsRepository: EventsRepository,
    private readonly bookingsRepository: BookingsRepository,
     private readonly logger:Logger
  ) {}

    async getEventAnalytics(eventId: number) {
    try{
    this.logger.log(`Fetching analytics for event ID: ${eventId}`);
    const [event] = await this.eventsRepository.findEventByIds([eventId]);

    if (!event) throw new Error('Event not found');

    this.logger.log(`Fetching bookings for event ID: ${eventId}`);
    const bookings = await this.bookingsRepository.getBookingByEventId(eventId);

    this.logger.log(`Calculating analytics for event ID: ${eventId}`);
    const totalSold = bookings.length;
    const revenue = bookings.reduce((sum:number, b:Booking) => sum + b.pricePaid, 0);
    const avgPrice = totalSold > 0 ? revenue / totalSold : 0;
    const remaining = event.totalTickets - totalSold;

    return {
      eventId,
      name: event.name,
      totalSold,
      remaining,
      revenue,
      avgPrice,
      date: event.date,
      venue: event.venue,
    };
  } catch (error: any) {
    this.logger.error(`Error fetching analytics for event ID: ${eventId}`, error);
    throw error;
  }
  }


  async getSummaryAnalytics() {
    try{
    this.logger.log('Fetching summary analytics for all events');
    const events = await this.eventsRepository.findAllEvent();

    let totalSold = 0;
    let totalRevenue = 0;
    let totalTickets = 0;

    for (const event of events) {
       if (!event || isNaN(event.id)) {
    console.warn("Skipping invalid event ID:", event.id);
    return null; 
  }
  
      const bookings = await this.bookingsRepository.getBookingByEventId(event.id);
      const sold = bookings.length;
      const revenue = bookings.reduce((sum:number, b:Booking) => sum + b.pricePaid, 0);

      totalSold += sold;
      totalRevenue += revenue;
      totalTickets += event.totalTickets;
    }

    return {
      totalEvents: events.length,
      totalTickets,
      totalSold,
      remaining: totalTickets - totalSold,
      totalRevenue,
      avgRevenuePerEvent:
        events.length > 0 ? totalRevenue / events.length : 0,
    };
  }

  catch (error: any) {
    this.logger.error('Error fetching summary analytics', error);
    throw error;
  }
  }
}
