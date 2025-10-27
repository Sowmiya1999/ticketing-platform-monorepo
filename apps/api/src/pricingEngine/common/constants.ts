import { PricingRules } from "../type/pricingRules.type";

export const defaultPricingRules: PricingRules = {
  weights: {
     time: parseFloat(process.env.TIME_WEIGHT!),
    demand: parseFloat(process.env.DEMAND_WEIGHT!),
    inventory: parseFloat(process.env.INVENTORY_WEIGHT!),
  },
  timeRules:  JSON.parse(process.env.TIME_RULES!),
  demandRules: JSON.parse(process.env.DEMAND_RULES!),
  inventoryRules:  JSON.parse(process.env.INVENTORY_RULES!),
};
