import { Type } from 'class-transformer';
import { IsString, IsDate, IsNumber, IsJSON, IsOptional, IsBoolean } from 'class-validator';


export class EventDTO {
  @IsString()
  name!: string;

  @IsString()
  venue!: string;

    @Type(() => Date) 
  @IsDate()
  date!: Date;

  @IsString()
  description!: string;

  @IsNumber()
  totalTickets!: number;

  @IsNumber()
  basePrice!: number;

  @IsNumber()
  floorPrice!: number;

  @IsNumber()
  ceilingPrice!: number;

  @IsOptional()
  @IsJSON()
  pricingRules?: Record<string, any> = {};

  @IsBoolean()
  isDefaultPricingRulesEnabled:boolean = true;
}
