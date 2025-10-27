import { Type } from 'class-transformer';
import { IsString, IsDate, IsNumber, IsJSON, IsOptional } from 'class-validator';

export class BookingDTO {
  @IsString()
  userEmail!: string;

  @IsNumber()
  eventId!: number;

  @IsNumber()
  quantity!: number;

  pricePaid!:number
}
