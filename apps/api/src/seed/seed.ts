import {db} from "../database";
import * as schema from "../database/schema";

async function seed() {
    const [event] = await db.insert(schema.events).values([{
        name: "ColdPlay Live",
        venue: "Nehru Stadium",
        date: "2025-12-15",
        description: "Live Concert for music",
        totalTickets: 200,
        bookedTickets: 0,
        basePrice:1000,
        currentPrice: 900,
        floorPrice:800,
        ceilingPrice: 1500,
        pricingRules: {
            timeBased:{7:0.2, 1:0.5},
            demandBased:{threshold: 10, increase: 0.15},
            inventoryBased:{remaining:0.2, increase: 0.25},

        }
    }]).returning();


await db.insert(schema.bookings).values({
    eventId: event!.id,
    userEmail:"user2@gmail.com",
    pricePaid:850,
    quantity:5
})

  console.log("Seed data added successfully:");
}

seed().then(() => process.exit(1)).catch(console.error);