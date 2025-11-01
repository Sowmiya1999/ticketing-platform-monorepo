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
          bookedTickets: 2,
          basePrice: 1000,
          currentPrice: 1100,
          floorPrice: 800,
          ceilingPrice: 1200,
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
            demandPercent: 0.35,
            demandAmount: 350,
            inventoryPercent: 0.25,
            inventoryAmount: 250,
            totalAdjustment: 1.0,
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
          bookedTickets: 1,
          basePrice: 800,
          currentPrice: 880,
          floorPrice: 640,
          ceilingPrice: 960,
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
            basePrice: 800,
            timePercent: 0.4,
            timeAmount: 320,
            demandPercent: 0.35,
            demandAmount: 280,
            inventoryPercent: 0.25,
            inventoryAmount: 200,
            totalAdjustment: 0.875,
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
          bookedTickets: 1,
          basePrice: 600,
          currentPrice: 660,
          floorPrice: 480,
          ceilingPrice: 720,
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
            basePrice: 600,
            timePercent: 0.4,
            timeAmount: 240,
            demandPercent: 0.35,
            demandAmount: 210,
            inventoryPercent: 0.25,
            inventoryAmount: 150,
            totalAdjustment: 0.875,
          },
          isDefaultPricingRulesEnabled: true,
          status: "ACTIVE",
        },
      ])
      .returning();

    await db.insert(schema.bookings).values([
      {
        id: 1,
        eventId: events[0]!.id,
        userEmail: "alice@gmail.com",
        quantity: 3,
        pricePaid: 3000,
        priceBreakdown: {
          basePrice: 1000,
          timeAmount: 400,
          timePercent: 0.4,
          demandAmount: 350,
          demandPercent: 0.35,
          inventoryAmount: 250,
          inventoryPercent: 0.25,
          totalAdjustment: 1.0,
        },
        status: "ACTIVE",
        createdAt: new Date("2025-11-01T10:59:47.227Z"),
      },
      {
        id: 2,
        eventId: events[1]!.id,
        userEmail: "bob@gmail.com",
        quantity: 2,
        pricePaid: 1760,
        priceBreakdown: {
          basePrice: 800,
          timeAmount: 320,
          timePercent: 0.4,
          demandAmount: 280,
          demandPercent: 0.35,
          inventoryAmount: 200,
          inventoryPercent: 0.25,
          totalAdjustment: 0.875,
        },
        status: "ACTIVE",
        createdAt: new Date("2025-11-01T14:12:12.120Z"),
      },
      {
        id: 3,
        eventId: events[2]!.id,
        userEmail: "charlie@gmail.com",
        quantity: 1,
        pricePaid: 660,
        priceBreakdown: {
          basePrice: 600,
          timeAmount: 240,
          timePercent: 0.4,
          demandAmount: 210,
          demandPercent: 0.35,
          inventoryAmount: 150,
          inventoryPercent: 0.25,
          totalAdjustment: 0.875,
        },
        status: "ACTIVE",
        createdAt: new Date("2025-11-01T09:47:55.500Z"),
      },
    ]);

   console.log("Seed data added successfully!");
    process.exit(0);
  }
}

new SeedService()
  .seed()
  .catch((err) => {
     console.log("Failed to add seedData", err);
    process.exit(1);
  });
