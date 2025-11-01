type PriceBreakdownResult = {
  timePercentage: string;      
  timeAmount: number;
  demandPercentage: number;
  demandAmount: number;
  inventoryPercentage: string ;
  inventoryAmount: number;
};
export type PricingResult = {
  eventId: number;
  quantity: number;
  basePrice: number;
  pricePaid: number;
  breakdown: PriceBreakdownResult;
};