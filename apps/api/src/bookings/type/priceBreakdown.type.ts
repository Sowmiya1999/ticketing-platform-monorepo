interface BreakdownMap{
    percentage:number,
    amount:number
}

export interface PriceBreakdown{
    
    pricePaid:number,
    basePrice: number,
    timePercent: number,
    timeAmount: number;
    demandPercent: number,
    demandAmount: number;
    inventoryPercent: number,
    inventoryAmount: number;

}