import { PricingEngineService } from "../pricingEngine/pricingEngine.service";

const mockEventsRepository = {
  updatePriceBreakDown: jest.fn(),
  getActiveEvents: jest.fn(),
};

const mockBookingsRepository = {
  getBookingInLastProvidedHours: jest.fn(),
};

describe('PricingEngineService – Pricing Calculation Logic', () => {
  let service: PricingEngineService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PricingEngineService(
      mockEventsRepository as any,
      mockBookingsRepository as any
    );
  });

  const basePrice = 100;
  const rules = {
    weights: { time: 0.4, demand: 0.35, inventory: 0.25 },
    timeRules: [
      { daysBefore: 30, weight: 0.05 },
      { daysBefore: 10, weight: 0.15 },
      { daysBefore: 5, weight: 0.25 },
    ],
    demandRules: [
      { threshold: 50, weight: 0.05 },
      { threshold: 100, weight: 0.15 },
    ],
    inventoryRules: [
      { threshold: 0.8, weight: 0.05 },
      { threshold: 0.5, weight: 0.15 },
      { threshold: 0.3, weight: 0.25 },
    ],
  };


  describe('Individual Rule Adjustments', () => {
    it('should compute correct time adjustment based on days before', () => {
      const adj1 = service['getTimeAdjustment'](25, rules.timeRules);
      const adj2 = service['getTimeAdjustment'](5, rules.timeRules);
      const adj3 = service['getTimeAdjustment'](1, rules.timeRules);

      expect(adj1).toBe(0.05); 
      expect(adj2).toBe(0.25);
      expect(adj3).toBe(0.25);
    });

    it('should compute correct demand adjustment based on recent bookings', () => {
      const adjLow = service['getDemandAdjustment'](60, rules.demandRules);
      const adjHigh = service['getDemandAdjustment'](120, rules.demandRules);
      const adjNone = service['getDemandAdjustment'](10, rules.demandRules);

      expect(adjLow).toBe(0.05);
      expect(adjHigh).toBe(0.15);
      expect(adjNone).toBe(0);
    });

    it('should compute correct inventory adjustment based on inventory ratio', () => {
      const adj1 = service['getInventoryAdjustment'](0.7, rules.inventoryRules);
      const adj2 = service['getInventoryAdjustment'](0.4, rules.inventoryRules);
      const adj3 = service['getInventoryAdjustment'](0.2, rules.inventoryRules);

      expect(adj1).toBe(0.05); 
      expect(adj2).toBe(0.15);
      expect(adj3).toBe(0.25);
    });
  });


  describe('Combined Rule Calculation', () => {
    it('should correctly compute total adjustment across rules', () => {
      const timeAdj = 0.15;
      const demandAdj = 0.1;
      const inventoryAdj = 0.2;

      const result = service['getTotalAdjustment'](
        basePrice,
        rules,
        timeAdj,
        demandAdj,
        inventoryAdj
      );

      const expectedTotal =
        timeAdj * rules.weights.time +
        demandAdj * rules.weights.demand +
        inventoryAdj * rules.weights.inventory;

      expect(result.totalAdjustment).toBeCloseTo(expectedTotal);
      expect(result.timeAmount).toBeCloseTo(basePrice * (timeAdj * 0.4));
      expect(result.demandAmount).toBeCloseTo(basePrice * (demandAdj * 0.35));
      expect(result.inventoryAmount).toBeCloseTo(
        basePrice * (inventoryAdj * 0.25)
      );
    });
  });


  describe('Floor and Ceiling Price Handling', () => {
    it('should cap price at ceiling if adjustment exceeds upper limit', () => {
      const priceAdjustment = {
        totalAdjustment: 0.8, 
        timePercent: 0.3,
        demandPercent: 0.3,
        inventoryPercent: 0.2,
      };

      const capped = service['recalculateFactorPercentageForCapped'](
        150, 
        100,
        { ...priceAdjustment }
      );

      expect(capped).toBe(150);
    });

    it('should cap price at floor if adjustment below lower limit', () => {
      const priceAdjustment = {
        totalAdjustment: -0.5,
        timePercent: -0.2,
        demandPercent: -0.2,
        inventoryPercent: -0.1,
      };

      const capped = service['recalculateFactorPercentageForCapped'](
        80, 
        100,
        { ...priceAdjustment }
      );

      expect(capped).toBe(80);
    });

    it('should rescale internal percentages proportionally when capped', () => {
      const adjustment = {
        totalAdjustment: 0.4,
        timePercent: 0.16,
        demandPercent: 0.14,
        inventoryPercent: 0.1,
      };

      const capped = service['recalculateFactorPercentageForCapped'](
        120,
        100,
        adjustment
      );

      expect(capped).toBe(120);
      expect(adjustment.totalAdjustment).toBeCloseTo(0.2);
      expect(adjustment.timePercent).toBeLessThan(0.16);
    });
  });
});
