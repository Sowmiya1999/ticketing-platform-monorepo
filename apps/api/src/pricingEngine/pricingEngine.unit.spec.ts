import { EventsRepository } from '../../src/repositories/event.repository';
import { BookingsRepository } from '../../src/repositories/booking.repository';
import { Event } from '../../src/database/schema';
import { PricingEngineService } from './pricingEngine.service';

describe('PricingEngineService - Pricing Logic', () => {
  let service: PricingEngineService;
  let mockEventsRepo: jest.Mocked<EventsRepository>;
  let mockBookingsRepo: jest.Mocked<BookingsRepository>;

  beforeEach(() => {
    mockEventsRepo = {
      getActiveEvents: jest.fn(),
      updatePriceBreakDown: jest.fn(),
    } as any;

    mockBookingsRepo = {
      getBookingInLastProvidedHours: jest.fn(),
    } as any;

    process.env.THRESHOLD_TIME_FOR_DEMANDS = '2';

    service = new PricingEngineService(
      mockEventsRepo,
      mockBookingsRepo
    );
  });

  // ---------- Test Time-Based Rule ----------
  it('applies time-based rule correctly', async () => {
    const event: Partial<Event> = {
      id: 1,
      basePrice: 1000,
      totalTickets: 100,
      bookedTickets: 10,
      date: String(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)), 
      floorPrice: 800,
      ceilingPrice: 1500,
      currentPrice: 1000,
      pricingRules: {
        timeRules: [
          { daysBefore: 10, weight: 0.05 },
          { daysBefore: 5, weight: 0.1 },
          { daysBefore: 2, weight: 0.2 },
        ],
        inventoryRules: [],
        demandRules: [],
        weights: { time: 1, demand: 0, inventory: 0 },
      },
    };

    mockEventsRepo.getActiveEvents.mockResolvedValue([event as Event]);
    mockBookingsRepo.getBookingInLastProvidedHours.mockResolvedValue(0);

    await service.calculatePricing();

    expect(mockEventsRepo.updatePriceBreakDown).toHaveBeenCalledWith(
      1,
      expect.any(Number),
      expect.objectContaining({
        timePercent: expect.any(Number),
        totalAdjustment: expect.any(Number),
      })
    );

    const [, newPrice] = mockEventsRepo.updatePriceBreakDown.mock.calls[0] || [];
    expect(newPrice).toBeGreaterThan(1000);
  });

  // ---------- Test Demand-Based Rule ----------
  it('applies demand-based rule correctly', async () => {
    const event: Partial<Event> = {
      id: 2,
      basePrice: 1000,
      totalTickets: 100,
      bookedTickets: 10,
      date: String(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)),
      floorPrice: 800,
      ceilingPrice: 1500,
      currentPrice: 1000,
      pricingRules: {
        timeRules: [],
        demandRules: [
          { threshold: 5, boost: 0.05 },
          { threshold: 10, boost: 0.1 },
        ],
        inventoryRules: [],
        weights: { time: 0, demand: 1, inventory: 0 },
      },
    };

    mockEventsRepo.getActiveEvents.mockResolvedValue([event as Event]);
    mockBookingsRepo.getBookingInLastProvidedHours.mockResolvedValue(12);

    await service.calculatePricing();

    const [, newPrice, breakdown] =
      mockEventsRepo.updatePriceBreakDown.mock.calls[0] || [];

    expect(breakdown.demandPercent).toBeCloseTo(0.1);
    expect(newPrice).toBe(1100);
  });

  // ---------- Test Inventory-Based Rule ----------
  it('applies inventory-based rule correctly', async () => {
    const event: Partial<Event> = {
      id: 3,
      basePrice: 1000,
      totalTickets: 100,
      bookedTickets: 90,
      date:  String(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)),
      floorPrice: 800,
      ceilingPrice: 1500,
      currentPrice: 1000,
      pricingRules: {
        timeRules: [],
        demandRules: [],
        inventoryRules: [
          { threshold: 0.5, boost: 0.05 },
          { threshold: 0.2, boost: 0.15 },
        ],
        weights: { time: 0, demand: 0, inventory: 1 },
      },
    };

    mockEventsRepo.getActiveEvents.mockResolvedValue([event as Event]);
    mockBookingsRepo.getBookingInLastProvidedHours.mockResolvedValue(0);

    await service.calculatePricing();

    const [, newPrice, breakdown] =
      mockEventsRepo.updatePriceBreakDown.mock.calls[0] || [];

    expect(breakdown.inventoryPercent).toBeCloseTo(0.15);
    expect(newPrice).toBe(1150);
  });

  // ----------  Test Combined Rules ----------
  it('applies combined time + demand + inventory rules correctly', async () => {
    const event: Partial<Event> = {
      id: 4,
      basePrice: 1000,
      totalTickets: 100,
      bookedTickets: 50,
      date:  String(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)),
      floorPrice: 800,
      ceilingPrice: 1500,
      currentPrice: 1000,
      pricingRules: {
        timeRules: [{ daysBefore: 10, weight: 0.05 }],
        demandRules: [{ threshold: 10, boost: 0.1 }],
        inventoryRules: [{ threshold: 0.5, boost: 0.05 }],
        weights: { time: 0.4, demand: 0.4, inventory: 0.2 },
      },
    };

    mockEventsRepo.getActiveEvents.mockResolvedValue([event as Event]);
    mockBookingsRepo.getBookingInLastProvidedHours.mockResolvedValue(15);

    await service.calculatePricing();

const [eventId, newPrice, breakdown] =
  mockEventsRepo.updatePriceBreakDown.mock.calls[0] || [];

    expect(breakdown.totalAdjustment).toBeCloseTo(
      0.05 * 0.4 + 0.1 * 0.4 + 0.05 * 0.2
    );
    expect(newPrice).toBeCloseTo(1000 * (1 + breakdown.totalAdjustment));
  });

  // ----------Test Floor and Ceiling Constraints ----------
  it('respects floor and ceiling price limits', async () => {
    const event: Partial<Event> = {
      id: 5,
      basePrice: 1000,
      totalTickets: 100,
      bookedTickets: 90,
      date:  String(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)),
      floorPrice: 900,
      ceilingPrice: 1100,
      currentPrice: 1000,
      pricingRules: {
        timeRules: [{ daysBefore: 2, weight: 0.5 }],
        demandRules: [{ threshold: 10, boost: 0.5 }],
        inventoryRules: [{ threshold: 0.2, boost: 0.5 }],
        weights: { time: 1, demand: 1, inventory: 1 },
      },
    };

    mockEventsRepo.getActiveEvents.mockResolvedValue([event as Event]);
    mockBookingsRepo.getBookingInLastProvidedHours.mockResolvedValue(20);

    await service.calculatePricing();

    const [, newPrice] = mockEventsRepo.updatePriceBreakDown.mock.calls[0] || [];

    
    expect(newPrice).toBeLessThanOrEqual(1100);
  });
});
