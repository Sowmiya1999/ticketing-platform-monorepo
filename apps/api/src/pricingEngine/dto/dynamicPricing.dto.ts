import { PricingRules } from "../type/pricingRules.type";

export interface EventPricingInput {
  date: Date;
  basePrice: number;
  currentPrice: number;
  totalTickets: number;
  bookedTickets: number;
  floorPrice: number;
  ceilingPrice: number;
  pricingRules?: Partial<PricingRules>;
  isDefaultPricingRulesEnabled?: boolean;
}