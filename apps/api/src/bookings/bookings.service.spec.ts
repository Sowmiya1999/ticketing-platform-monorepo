import { Test, TestingModule } from "@nestjs/testing";
import { Logger } from "@nestjs/common";
import { Booking } from "../database/schema";
import { BookingsService } from "./bookings.service";
import { BookingsRepository } from "../repositories/booking.repository";
import { GenericResponse } from "../lib/response/response";
import { BookingDTO } from "./dto/createBooking.dto";

describe("BookingsService", () => {
  let service: BookingsService;
  let repository: BookingsRepository;
  let logger: Logger;

  const mockBooking: Booking = {
    id: 1,
    eventId: 101,
    userEmail: "test@example.com",
    quantity: 2,
    priceBreakdown: {},
    currentPrice: 200,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as Booking;

  const mockRepository = {
    getBookingByEventId: jest.fn(),
    getBookingById: jest.fn(),
    createNewBooking: jest.fn(),
    findBookingByEmail: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  } as unknown as Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: BookingsRepository, useValue: mockRepository },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    repository = module.get<BookingsRepository>(BookingsRepository);
    logger = module.get<Logger>(Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getBookingByEventId", () => {
    it("should return bookings for a given event", async () => {
      mockRepository.getBookingByEventId.mockResolvedValue([mockBooking]);
      const result = await service.getBookingByEventId(101);
      expect(result).toEqual([mockBooking]);
      expect(mockRepository.getBookingByEventId).toHaveBeenCalledWith(101);
    });


  });

  describe("getBookingById", () => {
    it("should return booking for a given id", async () => {
      mockRepository.getBookingById.mockResolvedValue([mockBooking]);
      const result = await service.getBookingById(1);
      expect(result).toEqual([mockBooking]);
      expect(mockRepository.getBookingById).toHaveBeenCalledWith(1);
    });


  });

  describe("createBooking", () => {
    it("should create a booking successfully", async () => {
      const bookingDto: BookingDTO = {
        eventId: 101,
        userEmail: "test@example.com",
        quantity: 2,
        priceBreakdown: {} as any,
        currentPrice: 200,
      };
      mockRepository.createNewBooking.mockResolvedValue(mockBooking);

      const result: GenericResponse = await service.createBooking(bookingDto);

      expect(result).toEqual({
        data: mockBooking,
        message: expect.any(String),
      });
      expect(mockRepository.createNewBooking).toHaveBeenCalledWith(bookingDto);
      expect(mockLogger.debug).toHaveBeenCalled();
    });

    it("should return failure message if creation fails", async () => {
      const bookingDto: BookingDTO = {
        eventId: 101,
        userEmail: "test@example.com",
        quantity: 2,
        priceBreakdown: {} as any,
        currentPrice: 200,
      };
      mockRepository.createNewBooking.mockRejectedValue(new Error("fail"));

      const result: GenericResponse = await service.createBooking(bookingDto);

      expect(result.data).toBeNull();
      expect(result.message).toContain("fail");
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe("getBookingsByEmail", () => {
    it("should return bookings for a given email", async () => {
      mockRepository.findBookingByEmail.mockResolvedValue([mockBooking]);
      const result = await service.getBookingsByEmail("test@example.com");
      expect(result).toEqual([mockBooking]);
      expect(mockRepository.findBookingByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
    });

    it("should return empty array if repository throws", async () => {
      mockRepository.findBookingByEmail.mockRejectedValue(new Error("fail"));
      const result = await service.getBookingsByEmail("test@example.com");
      expect(result).toEqual([]);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
