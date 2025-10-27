type TimeRule = { daysBefore: number; weight: number };
type DemandRule = { threshold: number; boost: number };
type InventoryRule = { threshold: number; boost: number };

interface PricingWeights {
  time: number;
  demand: number;
  inventory: number;
}

export interface PricingRules {
  weights: PricingWeights;
  timeRules: TimeRule[];
  demandRules: DemandRule[];
  inventoryRules: InventoryRule[];
}
