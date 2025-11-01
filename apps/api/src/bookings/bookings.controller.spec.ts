import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Logger } from '@nestjs/common';
import { BookingDTO } from './dto/createBooking.dto';
import { GenericResponse } from '../lib/response/response';
import { Booking } from '../database/schema';
import { BookingWithEvent } from '../repositories/types/bookingWithEvent.type';

describe('BookingsController', () => {
  let controller: BookingsController;
  let bookingsService: Partial<BookingsService>;
  let logger: Logger;

  const mockBooking: Booking = {
    id: 1,
    eventId: 1,
    userEmail: 'test@example.com',
    quantity: 2,
    priceBreakdown:  {
       timePercentage: '10%',
      timeAmount: 10,
      demandPercentage: 5,
      demandAmount: 5,
      inventoryPercentage: '0%',
      inventoryAmount: 0,
    } as unknown as any,
    createdAt: new Date()
  } as Booking;

  const mockBookingWithEvent: BookingWithEvent = {
    ...mockBooking,
    eventName: 'Test Event',
    eventVenue: 'Test Hall',
    bookingId: mockBooking.id,
    currentPrice: 200,
    basePrice: 100,
  priceBreakdown: mockBooking.priceBreakdown as any,
  eventDate: new Date(),
  createdAt: mockBooking.createdAt as Date,
  };

  const mockResponse: GenericResponse = {
    message: 'Booking created successfully',
    data: mockBooking,
  };

  beforeEach(async () => {
    bookingsService = {
      getBookingByEventId: jest.fn().mockResolvedValue([mockBooking]),
      getBookingById: jest.fn().mockResolvedValue([mockBooking]),
      createBooking: jest.fn().mockResolvedValue(mockResponse),
      getBookingsByEmail: jest.fn().mockResolvedValue([mockBookingWithEvent]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        { provide: BookingsService, useValue: bookingsService },
        { provide: Logger, useValue: { log: jest.fn() } },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get bookings by event ID', async () => {
    const result = await controller.getBookingByEventId(1);
    expect(bookingsService.getBookingByEventId).toHaveBeenCalledWith(1);
    expect(result).toEqual([mockBooking]);
  });

  it('should get booking by booking ID', async () => {
    const result = await controller.getBookingByBookingId(1);
    expect(bookingsService.getBookingById).toHaveBeenCalledWith(1);
    expect(result).toEqual([mockBooking]);
  });

  it('should create a new booking', async () => {
    const bookingDTO: BookingDTO = {
      eventId: 1,
      userEmail: 'test@example.com',
      quantity: 2,
      currentPrice: 200,
      priceBreakdown:    {
       timePercent: 0.1,
      timeAmount: 10,
      demandPercent: 5,
      demandAmount: 5,
      inventoryPercent: 0,
      inventoryAmount: 0,
      basePrice: 100,
      pricePaid: 115
    },
    };
    const result = await controller.createBooking(bookingDTO);
    expect(bookingsService.createBooking).toHaveBeenCalledWith(bookingDTO);
    expect(result).toEqual(mockResponse);
  });

  it('should get bookings by email', async () => {
    const result = await controller.getBookingsByEmail('test@example.com');
    expect(bookingsService.getBookingsByEmail).toHaveBeenCalledWith('test@example.com');
    expect(result).toEqual([mockBookingWithEvent]);
  });
});
