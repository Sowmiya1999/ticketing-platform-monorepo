
export function mergePricingRules<PricingRules>(defaultPricingRules: PricingRules, customerPricingRules: Partial<PricingRules>): PricingRules {
  const output = { ...defaultPricingRules };
  for (const key in customerPricingRules) {
    const value = customerPricingRules[key];
    if (Array.isArray(value)) {
      (output as any)[key] = value;
    } else if (value && typeof value === 'object') {
      (output as any)[key] = mergePricingRules((defaultPricingRules as any)[key], value);
    } else if (value !== undefined) {
      (output as any)[key] = value;
    }
  }
  return output;
}

export function convertJson(pricingRules:any){
 
    const rules = typeof pricingRules === 'string'
      ? JSON.parse(pricingRules)
      : pricingRules || {};
    return rules;
 
}