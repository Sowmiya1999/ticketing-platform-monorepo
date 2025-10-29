import { IsString, IsNumber } from 'class-validator';
import { PriceBreakdown } from '../type/priceBreakdown.type';

export class BookingDTO {
  @IsString()
  userEmail!: string;

  @IsNumber()
  eventId!: number;

  @IsNumber()
  quantity!: number;

  @IsNumber()
  currentPrice!:number;

  @IsNumber()
  pricePaid?:number

  priceBreakdown!:PriceBreakdown;
}
