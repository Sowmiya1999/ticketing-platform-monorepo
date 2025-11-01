#  DESIGN.md

##  Dynamic Pricing Algorithm

The **dynamic pricing system** automatically adjusts event ticket prices in real-time based on **demand, inventory, and time** until the event.  

Each event has a configurable set of **pricing rules** defined in the backend. The algorithm uses weighted parameters stored as environment variables:

| Factor | Weight | Description |
|---------|---------|-------------|
| `TIME_WEIGHT` | 0.4 | Adjusts price based on how close the event date is. |
| `DEMAND_WEIGHT` | 0.35 | Reflects how booking demand impacts pricing. |
| `INVENTORY_WEIGHT` | 0.25 | Considers remaining ticket availability. |

Supporting rules like `TIME_RULES`, `DEMAND_RULES`, and `INVENTORY_RULES` provide finer control over pricing increments at different thresholds.

Initially, users were meant to **define their own pricing preferences** (e.g., *Low*, *Medium*, *High*) instead of entering numeric percentages.  
However, due to time constraints, this feature was simplified to a **toggle option** that lets users decide whether to apply backend-configured pricing adjustments or stick to static pricing.

The backend seamlessly falls back to **default pricing rules** if user-defined settings aren’t available, ensuring stable behavior across all events.

A **scheduler** runs every 30 seconds to refresh:
- Current event prices  
- Associated pricing breakdown  
- Rule changes directly in the database  

This ensures the system remains responsive to demand fluctuations without manual intervention.

---

##  Concurrency Management

Handling concurrency was a crucial design concern to **prevent overbooking** when multiple users attempt to reserve tickets simultaneously.

This was addressed using **PostgreSQL transactions with row-level locking (`FOR UPDATE`)**:

1. Fetch the event record and lock it for the current transaction.  
2. Verify ticket availability before booking.  
3. Update the `bookedTickets` count.  
4. Insert the new booking record.  
5. Commit or rollback the transaction based on outcome.

If two users try to book at the same time, the second transaction waits until the first completes.  
This guarantees **data consistency and integrity** while preserving scalability under load.

---

##  Monorepo Architecture

The project is structured as a **monorepo** that contains both frontend and backend under a single workspace.  
This design simplifies development and ensures smooth communication between components.

### Key Advantages:
- **Shared types and configurations** across all packages (via TypeScript).  
- **Simplified environment setup** — run both services with minimal commands.  

##  Design Trade-offs

Several trade-offs were made to balance functionality and delivery speed:

- Postponed the **user-friendly rule interface** in favor of the toggle-based configuration.  
- Focused primarily on **accuracy, reliability, and concurrency safety** in this phase.  
- Skipped complex **real-time analytics** to meet the initial milestone deadlines.

These choices ensured a stable, production-ready core while leaving room for scalable improvements.

---

##  Future Improvements

With more time, the following enhancements are planned:

###  Pricing Intelligence
- Add analytics to **recommend ideal pricing** for new events using historical booking data.

###  Automated Maintenance
- Implement a **cron job** to automatically mark past events as inactive and disable new bookings.

###  User Experience
- Introduce **seat map selection** and **hall route guidance** for attendees.  
- Provide a **friendly pricing interface** using intuitive labels like *Low*, *Medium*, *High*.

###  Insights and Reporting
- Build an **analytics dashboard** to visualize user engagement, sales performance, and pricing trends.

