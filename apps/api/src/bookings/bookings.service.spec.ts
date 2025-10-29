import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { BookingsRepository } from '../repositories/booking.repository';
import { BookingDTO } from './dto/createBooking.dto';
describe('BookingsService', () => {
  let service: BookingsService;
  let bookingRepository: BookingsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: BookingsRepository,
          useValue: {
            createNewBooking: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    bookingRepository = module.get<BookingsRepository>(BookingsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(bookingRepository).toBeDefined();
  });

    
});
