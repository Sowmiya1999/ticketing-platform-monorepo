# 🎨 Ticketing Platform Frontend

The **frontend** of the Ticketing Platform — a dynamic event booking system that displays real-time pricing updates, event listings, and booking flows.  
Built with **Next.js 15**, **TypeScript**, and **Tailwind CSS** for speed, scalability, and developer efficiency.

---

## ⚙️ Prerequisites

Make sure you have the following installed:

- **Node.js** ≥ 18.0.0  
- **npm** ≥ 9.0.0 (or **yarn/pnpm** equivalent)  
- Backend service running locally at `http://localhost:3001`

---

## 🛠️ Installation Steps

You can set up and run the project in under 5 commands:

```bash
# 1. Clone the repository
git clone <github url>

# 2. Navigate to the frontend directory
cd web

# 3. Install dependencies
pnpm install

# 4. Create a .env
cp .env.web.example .env

# 5. Run the development server
npm run dev


Environment Variables Documentation

NEXT_PUBLIC_API_BASE_URL     # Base URL for backend API (e.g., http://localhost:3001)
NEXT_PUBLIC_ADMIN_API_KEY    # Admin API key for admin-level operations
NEXT_PUBLIC_BOOKING_TIMER    # Timer duration (in seconds) for booking confirmation

NEXT_PUBLIC_MIN_FLOOR_WEIGHT # Defines the minimum allowed multiplier for the Floor Price relative to the Base Price.
NEXT_PUBLIC_MAX_FLOOR_WEIGHT # Defines the maximum allowed multiplier for the Floor Price relative to the Base Price.

NEXT_PUBLIC_MIN_CEILING_WEIGHT # Defines the minimum allowed multiplier for the Ceiling Price relative to the Base Price.
NEXT_PUBLIC_MAX_CEILING_WEIGHT # Defines the maximum allowed multiplier for the Ceiling Price relative to the Base Price.
