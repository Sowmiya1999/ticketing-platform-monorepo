Ticketing Platform Monorepo

A sophisticated event management and ticketing system built with NestJS, PostgreSQL, and Drizzle ORM.
It features intelligent dynamic pricing algorithms, real-time availability tracking, and robust concurrency handling to prevent overbooking.



Tech Stack

Backend: NestJS (TypeScript)

Database: PostgreSQL

ORM: Drizzle ORM

Cache (optional): Redis (Upstash)

Testing: Jest

Runtime: Node.js v22.17.0



Before running the project, ensure you have:

Node.js: v22.17.0 or higher

PostgreSQL: running locally at localhost:5432

npm: v10+



Installation (Under 5 Commands)

# 1. Clone the repository
git clone <github url>
cd ticketing-platform-monorepo

# 2. Install dependencies
npm install

# 3. Set up database
 npm run db:setup

# 4. Seed initial data
npm run seed

# 5. Start the development server
npm run dev



Running Tests
# Run all tests
npm run test

# Watch mode (live test updates)
npm run test:watch

# Run with coverage report
npm run test:cov

environment variable documentation
DATABASE_URL=            # PostgreSQL connection string
PORT=                    # Port number for the backend server
NODE_ENV=                # Environment type (development | production | test)

THRESHOLD_TIME_FOR_DEMANDS=  # Time (in hours) for evaluating demand fluctuations

TIME_WEIGHT=                 # Weight for time-based influence in pricing
DEMAND_WEIGHT=               # Weight for demand-based influence
INVENTORY_WEIGHT=            # Weight for inventory-based influence

TIME_RULES=                  # JSON array defining time-based pricing rules
DEMAND_RULES=                # JSON array defining demand-based pricing rules
INVENTORY_RULES=             # JSON array defining inventory-based pricing rules

ADMIN_API_KEY=               # Secret key for admin API access

