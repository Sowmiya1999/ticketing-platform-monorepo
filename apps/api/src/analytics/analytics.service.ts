import { Injectable } from '@nestjs/common';
import { EventsRepository } from '../repositories/event.repository';
import { BookingsRepository } from '../repositories/booking.repository';
import { Booking } from '../database/schema';

@Injectable()
export class AnalyticsService {
    constructor(
    private readonly eventsRepository: EventsRepository,
    private readonly bookingsRepository: BookingsRepository,
  ) {}

    async getEventAnalytics(eventId: number) {
    const [event] = await this.eventsRepository.findEventByIds([eventId]);
    if (!event) throw new Error('Event not found');

    const bookings = await this.bookingsRepository.getBookingByEventId(eventId);

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
  }

  async getSummaryAnalytics() {
    const events = await this.eventsRepository.findAllEvent();

    let totalSold = 0;
    let totalRevenue = 0;
    let totalTickets = 0;

    for (const event of events) {
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

}
