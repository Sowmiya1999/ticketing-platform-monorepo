Frontend

# DESIGN.md

## Overview

The frontend of the **Dynamic Ticketing Platform** is built using **Next.js (App Router)** with **TypeScript** and **Tailwind CSS**.  
It provides a seamless interface for users to browse events, calculate dynamic ticket prices, and make bookings — while also offering admin controls for event creation.

The design emphasizes real-time updates, minimal state management complexity, and a clean, user-focused layout.

---

## Architecture

The project follows a modular structure under the `/app` directory, leveraging the **App Router** for server-side rendering and layout composition.

### Folder Structure

app/
│ layout.tsx
│ page.tsx
│
├── add-event/ → Admin event creation page
├── bookings/
│ └── success/ → Booking confirmation page
├── components/ → Reusable UI components (BookingForm, Header, etc.)
│ └── card/ → EventCard component
├── events/ → Event listing and details
│ └── [id]/ → Dynamic route for event details
├── my-bookings/ → User bookings lookup page
├── fonts/ → Custom Geist fonts
│
└── lib/ → Client-side API utilities
├── api.ts
└── clientApi.ts


---

## Core Features

### 🏠 Home & Navigation
The home page (`/`) includes a navigation bar with two main menus:
- **Events** → Dropdown with options to *Add Event* (admin) or *View Events*
- **My Bookings** → Lets users view all bookings by email

### 🎟️ View Events (`/events`)
Displays a list of upcoming events with:
- Event name, venue, date  
- Current dynamic price  
- Available tickets  
- A **View** button for detailed booking

Prices and availability automatically refresh **every 30 seconds** to reflect backend updates.

### 📄 Event Details (`/events/[id]`)
Shows event description and allows users to:
1. Choose ticket quantity  
2. Enter email address  
3. Calculate price using the **"Calculate Price"** button  

When the button is clicked, a **price breakdown** appears showing:
- Base price  
- Adjustments by time, demand, and inventory factors  
- Final price to be paid  

A **2-minute timer** starts when this page is opened.  
If the user doesn’t confirm the booking within the timer, they are redirected back to the `/events` page — preventing outdated price bookings.  
If the quantity is changed, the breakdown auto-hides until recalculated.

### ✅ Booking Confirmation (`/bookings/success`)
After a booking is confirmed, the user is redirected here.  
The page shows:
- Event details  
- Quantity booked  
- Price paid  
- Price breakdown  
- A **current price comparison** showing whether the price has increased, decreased, or remained unchanged since purchase.

### 📬 My Bookings (`/my-bookings`)
Users can enter their email ID to view all their past bookings.  
Each booking card shows the event details along with a live price comparison.

### ⚙️ Admin: Add Event (`/add-event`)
Protected via an **Admin API key**, this page allows event creation.  
The form includes:
- Event name, venue, date & time, and description  
- Base, floor, and ceiling prices  
- Total ticket count  
- Toggle to include or exclude dynamic pricing factors  

Validation ensures:
- `ceilingPrice > basePrice > floorPrice`  
- `ceiling > base * Number(process.env.NEXT_PUBLIC_MIN_CEILING_WEIGHT)`
  `floor > base * Number(process.env.NEXT_PUBLIC_MIN_FLOOR_WEIGHT)`
- Event date cannot be set in the past  

---

## API Integration

All API interactions are handled through `lib/clientApi.ts, lib/api.ts`, with the base URL configured via:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001


Key API endpoints used:

GET /events → Fetch active events

GET /events/:id → Fetch single event details

POST /bookings → Create a new booking

GET /bookings?email= → Fetch user bookings

POST /events → Admin event creation

No authentication is required for public endpoints.
The admin routes use NEXT_PUBLIC_ADMIN_API_KEY for basic protection.



Trade-offs & Future Improvements
Current Simplifications

Authentication is skipped; admin is protected by an API key.

Seat selection and hall mapping are not implemented.


Planned Enhancements

Implement proper authentication and role-based access.

Add seat map and route navigation to the hall.

Introduce analytics dashboard for admins to view engagement metrics.

Provide a personalized price recommendation view using historical data.

Improve timer-based booking with visual countdown and smoother auto-expiry handling.