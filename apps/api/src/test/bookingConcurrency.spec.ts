import { db } from '../database';
import { BookingsRepository } from '../repositories/booking.repository';
import { events, bookings } from '../database/schema';
import { BookingDTO } from '../bookings/dto/createBooking.dto';
import { PriceBreakdown } from '../bookings/type/priceBreakdown.type';
import { eq } from 'drizzle-orm';
describe('BookingsRepository - Concurrency Handling', () => {
  let repo: BookingsRepository;

  beforeAll(async () => {
    repo = new BookingsRepository();

    await db.delete(bookings);
    await db.delete(events);

    await db.insert(events).values({
      id: 1,
      name: 'Tech Conference 2025',
      venue: 'Innovation Hall',
      date: '2025-12-31',
      description: 'Testing concurrent booking prevention',
      totalTickets: 1,
      bookedTickets: 0,
      basePrice: 1000,
      currentPrice: 1000,
      floorPrice: 800,
      ceilingPrice: 1500,
      pricingRules: {},
    });
  });

  it('should prevent overbooking when two users book the last ticket simultaneously', async () => {
    const priceBreakdown: PriceBreakdown = {
      pricePaid: 1000,
      basePrice: 1000,
      timePercent: 0,
      timeAmount: 0,
      demandPercent: 0,
      demandAmount: 0,
      inventoryPercent: 0,
      inventoryAmount: 0,
    };

 
    const bookingA: BookingDTO = {
      eventId: 1,
      userEmail: 'userA@example.com',
      quantity: 1,
      priceBreakdown,
      currentPrice:1000
    };

    const bookingB: BookingDTO = {
      eventId: 1,
      userEmail: 'userB@example.com',
      quantity: 1,
      priceBreakdown,
        currentPrice:1000
    };

   
    const results = await Promise.allSettled([
      repo.createNewBooking(bookingA),
      repo.createNewBooking(bookingB),
    ]);

    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r) => r.status === 'rejected');

    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(1);

    const [event] = await db.select().from(events).where(eq(events.id,1));
    expect(event!.bookedTickets).toBeLessThanOrEqual(event!.totalTickets);

    const allBookings = await db.select().from(bookings);
    expect(allBookings.length).toBe(1);

    const rejectedError = rejected[0] as PromiseRejectedResult;
    expect(rejectedError.reason.message).toMatch(/Not enough tickets available/);
  });
});
