import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { EventsRepository } from '../repositories/event.repository';
import { BookingsRepository } from '../repositories/booking.repository';
import { Logger } from '@nestjs/common';
import { Booking } from '../database/schema';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let eventsRepo: EventsRepository;
  let bookingsRepo: BookingsRepository;

  const mockLogger = { log: jest.fn(), error: jest.fn() };
  const mockEventsRepo = {
    findEventByIds: jest.fn(),
    findAllEvent: jest.fn(),
  };
  const mockBookingsRepo = {
    getBookingByEventId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: EventsRepository, useValue: mockEventsRepo },
        { provide: BookingsRepository, useValue: mockBookingsRepo },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    eventsRepo = module.get<EventsRepository>(EventsRepository);
    bookingsRepo = module.get<BookingsRepository>(BookingsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEventAnalytics', () => {
    const mockEvent = {
      id: 1,
      name: 'Test Event',
      totalTickets: 100,
      date: new Date(),
      venue: 'Test Hall',
    };
    const mockBookings: Booking[] = [
      { id: 1, eventId: 1, userEmail: 'a@test.com', quantity: 1, pricePaid: 100, priceBreakdown: {}, status: 'ACTIVE', createdAt: new Date() },
      { id: 2, eventId: 1, userEmail: 'b@test.com', quantity: 1, pricePaid: 200, priceBreakdown: {}, status: 'ACTIVE', createdAt: new Date() },
    ];

    it('should return analytics for a valid event', async () => {
      mockEventsRepo.findEventByIds.mockResolvedValue([mockEvent]);
      mockBookingsRepo.getBookingByEventId.mockResolvedValue(mockBookings);

      const result = await service.getEventAnalytics(1);

      expect(result.eventId).toBe(mockEvent.id);
      expect(result.totalSold).toBe(mockBookings.length);
      expect(result.revenue).toBe(300);;
      expect(mockLogger.log).toHaveBeenCalledWith('Fetching analytics for event ID: 1');
      expect(mockLogger.log).toHaveBeenCalledWith('Fetching bookings for event ID: 1');
      expect(mockLogger.log).toHaveBeenCalledWith('Calculating analytics for event ID: 1');
    });

    it('should throw error if event not found', async () => {
      mockEventsRepo.findEventByIds.mockResolvedValue([]);
      await expect(service.getEventAnalytics(1)).rejects.toThrow('Event not found');
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('getSummaryAnalytics', () => {
    const mockEvents = [
      { id: 1, name: 'Event 1', totalTickets: 100, date: new Date(), venue: 'Hall 1' },
      { id: 2, name: 'Event 2', totalTickets: 50, date: new Date(), venue: 'Hall 2' },
    ];
    const mockBookingsEvent1: Booking[] = [
      { id: 1, eventId: 1, userEmail: 'a@test.com', quantity: 1, pricePaid: 100, priceBreakdown: {}, status: 'ACTIVE', createdAt: new Date() },
    ];
    const mockBookingsEvent2: Booking[] = [
      { id: 2, eventId: 2, userEmail: 'b@test.com', quantity: 1, pricePaid: 200, priceBreakdown: {}, status: 'ACTIVE', createdAt: new Date() },
    ];

    it('should return summary analytics', async () => {
      mockEventsRepo.findAllEvent.mockResolvedValue(mockEvents);
      mockBookingsRepo.getBookingByEventId
        .mockResolvedValueOnce(mockBookingsEvent1)
        .mockResolvedValueOnce(mockBookingsEvent2);

      const result = await service.getSummaryAnalytics();

      expect(result!.totalEvents).toBe(2);
      expect(result!.totalSold).toBe(2);
      expect(result!.totalRevenue).toBe(300);
      expect(result!.remaining).toBe(148);
      expect(result!.avgRevenuePerEvent).toBe(150);
      expect(mockLogger.log).toHaveBeenCalledWith('Fetching summary analytics for all events');
    });

    it('should throw error when repository fails', async () => {
      mockEventsRepo.findAllEvent.mockRejectedValue(new Error('DB error'));
      await expect(service.getSummaryAnalytics()).rejects.toThrow('DB error');
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
