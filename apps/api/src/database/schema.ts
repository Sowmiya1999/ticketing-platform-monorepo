import {
  serial,
  varchar,
  integer,
  text,
  date,
  jsonb,
  timestamp,
  pgTable,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";

export const STATUS_ENUM = pgEnum("status_enum", [
  "ACTIVE",
  "INACTIVE",
  "DELETED",
]);

// events table definition
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  venue: varchar("venue", { length: 255 }).notNull(),
  date: date("date").notNull(),
  description: text("description"),
  totalTickets: integer("total_tickets").notNull(),
  bookedTickets: integer("booked_tickets").default(0),
  basePrice: integer("base_price").notNull(),
  currentPrice: integer("current_price").notNull(),
  floorPrice: integer("floor_price").notNull(),
  ceilingPrice: integer("ceiling_price").notNull(),
  pricingRules: jsonb("pricing_rules").default({}),
  priceBreakDown: jsonb("price_breakdown").default({}),
  isDefaultPricingRulesEnabled: boolean(
    "is_default_pricing_rules_enabled"
  ).default(true),
  status: STATUS_ENUM("status").notNull().default("ACTIVE"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Event = InferSelectModel<typeof events>;

// bookings table definition
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id")
    .notNull()
    .references(() => events.id),
  userEmail: varchar("user_email", { length: 255 }).notNull(),
  quantity: integer("quantity").notNull(),
  pricePaid: integer("price_paid").notNull(),
  priceBreakdown: jsonb("price_breakdown").default({}),
  status: STATUS_ENUM("status").notNull().default("ACTIVE"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Booking = InferSelectModel<typeof bookings>;

// defining relations between the events table and bookings table
export const eventRelations = relations(events, ({ many }) => ({
  bookings: many(bookings),
}));

// defining relations between the bookings table and events table
export const bookingRelations = relations(bookings, ({ one }) => ({
  event: one(events, {
    fields: [bookings.eventId],
    references: [events.id],
  }),
}));
