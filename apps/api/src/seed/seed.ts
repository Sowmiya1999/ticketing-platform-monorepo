import { db } from "../database";
import * as schema from "../database/schema";

export class SeedService {
  async seed() {
    await db.delete(schema.bookings);
    await db.delete(schema.events);

    const events = await db
      .insert(schema.events)
      .values([
        {
          name: "ColdPlay Live",
          venue: "Hall 1",
          date: "2025-12-15",
          description: "A grand live concert featuring ColdPlay’s world tour.",
          totalTickets: 200,
          bookedTickets: 0,
          basePrice: 1000,
          currentPrice: 1100,
          floorPrice: 850,
          ceilingPrice: 1500,
          pricingRules: {
            weights: { time: 0.4, demand: 0.35, inventory: 0.25 },
            timeRules: [
              { weight: 0.1, daysBefore: 30 },
              { weight: 0.4, daysBefore: 14 },
              { weight: 0.7, daysBefore: 7 },
              { weight: 1, daysBefore: 3 },
            ],
            demandRules: [
              { weight: 0.2, threshold: 0.3 },
              { weight: 0.5, threshold: 0.6 },
              { weight: 1, threshold: 0.8 },
            ],
            inventoryRules: [
              { weight: 0.2, threshold: 0.8 },
              { weight: 0.6, threshold: 0.5 },
              { weight: 1, threshold: 0.3 },
            ],
          },
          priceBreakDown: {
            basePrice: 1000,
            timePercent: 0.4,
            timeAmount: 400,
            demandPercent: 0.1,
            demandAmount: 100,
            inventoryPercent: 0.05,
            inventoryAmount: 50,
            totalAdjustment: 0.55,
          },
          isDefaultPricingRulesEnabled: true,
          status: "ACTIVE",
        },
        {
          name: "Tech Conference 2025",
          venue: "Hall 2",
          date: "2025-11-20",
          description: "A global tech summit with 50+ speakers and startups.",
          totalTickets: 500,
          bookedTickets: 0,
          basePrice: 800,
          currentPrice: 950,
          floorPrice: 700,
          ceilingPrice: 1300,
          pricingRules: {
            weights: { time: 0.5, demand: 0.3, inventory: 0.2 },
            timeRules: [
              { weight: 0.1, daysBefore: 45 },
              { weight: 0.4, daysBefore: 20 },
              { weight: 0.7, daysBefore: 10 },
              { weight: 1, daysBefore: 5 },
            ],
            demandRules: [
              { weight: 0.3, threshold: 0.4 },
              { weight: 0.6, threshold: 0.7 },
              { weight: 1, threshold: 0.9 },
            ],
            inventoryRules: [
              { weight: 0.3, threshold: 0.75 },
              { weight: 0.6, threshold: 0.5 },
              { weight: 1, threshold: 0.25 },
            ],
          },
          priceBreakDown: {
            basePrice: 800,
            timePercent: 0.3,
            timeAmount: 240,
            demandPercent: 0.05,
            demandAmount: 40,
            inventoryPercent: 0.02,
            inventoryAmount: 16,
            totalAdjustment: 0.37,
          },
          isDefaultPricingRulesEnabled: true,
          status: "ACTIVE",
        },
        {
          name: "Stand-up Night",
          venue: "Hall 3",
          date: "2025-11-05",
          description: "An evening of laughter with India's top comedians.",
          totalTickets: 150,
          bookedTickets: 0,
          basePrice: 600,
          currentPrice: 720,
          floorPrice: 500,
          ceilingPrice: 900,
          pricingRules: {
            weights: { time: 0.3, demand: 0.4, inventory: 0.3 },
            timeRules: [
              { weight: 0.1, daysBefore: 30 },
              { weight: 0.3, daysBefore: 14 },
              { weight: 0.6, daysBefore: 7 },
              { weight: 1, daysBefore: 2 },
            ],
            demandRules: [
              { weight: 0.2, threshold: 0.3 },
              { weight: 0.6, threshold: 0.6 },
              { weight: 1, threshold: 0.85 },
            ],
            inventoryRules: [
              { weight: 0.3, threshold: 0.8 },
              { weight: 0.6, threshold: 0.5 },
              { weight: 1, threshold: 0.3 },
            ],
          },
          priceBreakDown: {
            basePrice: 600,
            timePercent: 0.2,
            timeAmount: 120,
            demandPercent: 0.1,
            demandAmount: 60,
            inventoryPercent: 0.05,
            inventoryAmount: 30,
            totalAdjustment: 0.35,
          },
          isDefaultPricingRulesEnabled: true,
          status: "ACTIVE",
        },
      ])
      .returning();

    await db.insert(schema.bookings).values([
      {
        eventId: events[0]!.id,
        userEmail: "alice@gmail.com",
        quantity: 3,
        pricePaid: 1100,
        priceBreakdown: {
          basePrice: 1000,
          timePercent: 0.4,
          timeAmount: 400,
          demandPercent: 0.1,
          demandAmount: 100,
          inventoryPercent: 0.05,
          inventoryAmount: 50,
          totalAdjustment: 0.55,
        },
      },
      {
        eventId: events[0]!.id,
        userEmail: "bob@gmail.com",
        quantity: 2,
        pricePaid: 1050,
        priceBreakdown: {
          basePrice: 1000,
          timePercent: 0.3,
          timeAmount: 300,
          demandPercent: 0.05,
          demandAmount: 50,
          inventoryPercent: 0.02,
          inventoryAmount: 20,
          totalAdjustment: 0.37,
        },
      },
      {
        eventId: events[1]!.id,
        userEmail: "charlie@gmail.com",
        quantity: 1,
        pricePaid: 950,
        priceBreakdown: {
          basePrice: 800,
          timePercent: 0.3,
          timeAmount: 240,
          demandPercent: 0.05,
          demandAmount: 40,
          inventoryPercent: 0.02,
          inventoryAmount: 16,
          totalAdjustment: 0.37,
        },
      },
      {
        eventId: events[2]!.id,
        userEmail: "diana@gmail.com",
        quantity: 2,
        pricePaid: 720,
        priceBreakdown: {
          basePrice: 600,
          timePercent: 0.2,
          timeAmount: 120,
          demandPercent: 0.1,
          demandAmount: 60,
          inventoryPercent: 0.05,
          inventoryAmount: 30,
          totalAdjustment: 0.35,
        },
      },
    ]);

    console.log(" Seed data added successfully!");
    process.exit(0);
  }
}

new SeedService()
  .seed()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
