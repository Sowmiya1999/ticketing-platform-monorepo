import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Logger } from '@nestjs/common';
import { EventDTO } from './dto/createEvent.dto';
import { Event } from '../database/schema';
import { PriceBreakdown } from '../bookings/type/priceBreakdown.type';
import { PricingResult } from './types/priceBreakdown.type';

describe('EventsController', () => {
  let controller: EventsController;
  let eventsService: Partial<EventsService>;
  let logger: Logger;

  const mockEvent: Event = {
    id: 1,
    name: 'Test Event',
    venue: 'Test Hall',
    date: new Date().toISOString(),
    description: 'Test Description',
    totalTickets: 100,
    basePrice: 100,
    currentPrice: 100,
    floorPrice: 90,
    ceilingPrice: 150,
    pricingRules: {},
    isDefaultPricingRulesEnabled: true,
    status: 'ACTIVE',
    bookedTickets: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    priceBreakDown: {
       timePercentage: '10%',
      timeAmount: 10,
      demandPercentage: 5,
      demandAmount: 5,
      inventoryPercentage: '0%',
      inventoryAmount: 0,
    }
  } as Event;

  const mockPricingResult: PricingResult = {
    eventId: 1,
    quantity: 2,
    basePrice: 100,
    pricePaid: 200,
    breakdown: {
      timePercentage: '10%',
      timeAmount: 10,
      demandPercentage: 5,
      demandAmount: 5,
      inventoryPercentage: '0%',
      inventoryAmount: 0,
    },
  };

  beforeEach(async () => {
    eventsService = {
      getAllEventsData: jest.fn().mockResolvedValue([mockEvent]),
      getEventById: jest.fn().mockResolvedValue(mockEvent),
      createNewEvent: jest.fn().mockResolvedValue(mockEvent),
      calculatePriceBreakDown: jest.fn().mockResolvedValue(mockPricingResult),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        { provide: EventsService, useValue: eventsService },
        { provide: Logger, useValue: { log: jest.fn() } },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all events', async () => {
    const result = await controller.getAllEvents();
    expect(eventsService.getAllEventsData).toHaveBeenCalled();
    expect(result).toEqual([mockEvent]);
  });

  it('should get event by ID', async () => {
    const result = await controller.getEventById(1);
    expect(eventsService.getEventById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockEvent);
  });

  it('should create a new event', async () => {
    const eventDTO: EventDTO = {
      name: 'New Event',
      venue: 'Venue',
      date: new Date(),
      description: 'Desc',
      totalTickets: 50,
      basePrice: 100,
      floorPrice: 90,
      ceilingPrice: 120,
      pricingRules: {},
      isDefaultPricingRulesEnabled: true,
    };
    const result = await controller.createEvent(eventDTO);
    expect(eventsService.createNewEvent).toHaveBeenCalledWith(eventDTO);
    expect(result).toEqual(mockEvent);
  });

  it('should calculate price breakdown', async () => {
    const body: { quantity: number; priceBreakDown: PriceBreakdown } = {
      quantity: 2,
      priceBreakDown: {} as PriceBreakdown,
    };
    const result = await controller.getEventPriceBreakDown(1, body);
    expect(eventsService.calculatePriceBreakDown).toHaveBeenCalledWith(1, body.quantity, body.priceBreakDown);
    expect(result).toEqual(mockPricingResult);
  });
});
