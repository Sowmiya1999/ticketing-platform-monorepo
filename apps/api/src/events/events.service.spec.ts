import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { EventsRepository } from '../repositories/event.repository';
import { PricingEngineService } from '../pricingEngine/pricingEngine.service';
import { Logger } from '@nestjs/common';
import { EventDTO } from './dto/createEvent.dto';
import { Event } from '../database/schema';
import { defaultPricingRules } from '../pricingEngine/common/constants';
import {  PricingResult } from './types/priceBreakdown.type';
import { PriceBreakdown } from '../bookings/type/priceBreakdown.type';

describe('EventsService', () => {
  let service: EventsService;
  let eventsRepository: EventsRepository;
  let pricingEngineService: PricingEngineService;

  const mockLogger = { log: jest.fn(), error: jest.fn(), debug: jest.fn() };

  const mockEvent: Event = {
    id: 1,
    name: 'Test Event',
    venue: 'Test Hall',
    date: new Date().toISOString(),
    description: 'Desc',
    totalTickets: 100,
    bookedTickets: 0,
    basePrice: 100,
    currentPrice: 100,
    floorPrice: 90,
    ceilingPrice: 150,
    pricingRules: {},
    priceBreakDown: {},
    isDefaultPricingRulesEnabled: true,
    status: 'ACTIVE',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: EventsRepository,
          useValue: {
            findAllEvent: jest.fn().mockResolvedValue([mockEvent]),
            findEventByIds: jest.fn().mockResolvedValue([mockEvent]),
            createEvent: jest.fn().mockResolvedValue(mockEvent),
          },
        },
        {
          provide: PricingEngineService,
          useValue: { calculatePricing: jest.fn() }, 
        },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventsRepository = module.get<EventsRepository>(EventsRepository);
    pricingEngineService = module.get<PricingEngineService>(PricingEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllEventsData', () => {
    it('should return all events', async () => {
      const result = await service.getAllEventsData();
      expect(result).toEqual([mockEvent]);
      expect(eventsRepository.findAllEvent).toHaveBeenCalled();
    });
  });

  describe('getEventById', () => {
    it('should return single event by ID', async () => {
      const result = await service.getEventById(1);
      expect(result).toEqual(mockEvent);
      expect(eventsRepository.findEventByIds).toHaveBeenCalledWith([1]);
    });
  });

  describe('createNewEvent', () => {
    it('should create a new event and call pricing engine', async () => {
      const eventData: EventDTO = {
        name: 'New Event',
        venue: 'Venue',
        date: new Date(),
        description: 'Desc',
        totalTickets: 50,
        basePrice: 100,
        floorPrice: 80,
        ceilingPrice: 150,
        isDefaultPricingRulesEnabled: true,
        pricingRules: {},
      };

      const result = await service.createNewEvent(eventData);
      expect(result).toEqual(mockEvent);
      expect(eventsRepository.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'New Event' })
      );
      expect(pricingEngineService.calculatePricing).toHaveBeenCalled();
    });
  });

  describe('calculatePriceBreakDown', () => {
    it('should calculate total price and breakdown', async () => {
      const breakdown: PriceBreakdown = {
        basePrice: 100,
        pricePaid: 0,
        timePercent: 10,
        timeAmount: 20,
        demandPercent: 5,
        demandAmount: 10,
        inventoryPercent: 2,
        inventoryAmount: 5,
      };

      const result: PricingResult = await service.calculatePriceBreakDown(
        1,
        2,
        breakdown
      );

      expect(result.eventId).toBe(1);
      expect(result.quantity).toBe(2);
      expect(result.basePrice).toBe(200);
      expect(result.pricePaid).toBe(200 + 20 * 2 + 10 * 2 + 5 * 2); 
      expect(result.breakdown.timeAmount).toBe(40);
      expect(result.breakdown.demandAmount).toBe(20);
      expect(result.breakdown.inventoryAmount).toBe(10);
    });
  });
});
