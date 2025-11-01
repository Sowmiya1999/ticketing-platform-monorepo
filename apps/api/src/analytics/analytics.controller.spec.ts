import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Logger } from '@nestjs/common';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let analyticsService: AnalyticsService;

  const mockLogger = { log: jest.fn() };

  const mockAnalyticsService = {
    getSummaryAnalytics: jest.fn().mockResolvedValue({ totalEvents: 5, totalBookings: 10 }),
    getEventAnalytics: jest.fn().mockResolvedValue({ eventId: 1, bookedTickets: 50 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        { provide: AnalyticsService, useValue: mockAnalyticsService },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    analyticsService = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSummaryAnalytics', () => {
    it('should call analyticsService.getSummaryAnalytics and return data', async () => {
      const result = await controller.getSummaryAnalytics();
      expect(analyticsService.getSummaryAnalytics).toHaveBeenCalled();
      expect(result).toEqual({ totalEvents: 5, totalBookings: 10 });
      expect(mockLogger.log).toHaveBeenCalledWith('Entered AnalyticsController.getSummaryAnalytics called');
    });
  });

  describe('getEventAnalytics', () => {
    it('should call analyticsService.getEventAnalytics with eventId and return data', async () => {
      const eventId = 1;
      const result = await controller.getEventAnalytics(eventId);
      expect(analyticsService.getEventAnalytics).toHaveBeenCalledWith(eventId);
      expect(result).toEqual({ eventId: 1, bookedTickets: 50 });
      expect(mockLogger.log).toHaveBeenCalledWith('Entered AnalyticsController.getEventAnalytics called');
    });
  });
});
