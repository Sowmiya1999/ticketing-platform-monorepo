'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Ticket, MapPin, BarChart3, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
             Ticketing System
          </h1>
          <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition">
            Book a Venue
          </button>
        </div>
      </header>

   
      <main className="max-w-7xl mx-auto px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-6xl font-extralight mb-6 bg-gradient-to-r from-indigo-400 via-sky-400 to-blue-400 bg-clip-text text-transparent">
            Discover Spaces for Your Next Event
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Simplify your event booking experience. Explore curated venues, check real-time
            availability, and make reservations effortlessly — all in one intelligent platform.
          </p>
        </motion.div>

     
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="group bg-slate-800/40 border border-slate-700/40 rounded-2xl p-8 hover:bg-slate-800/70 hover:border-indigo-500/40 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-indigo-600/20 group-hover:bg-indigo-600/40 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-100">
                  {feature.title}
                </h3>
              </div>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

       
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-24 text-center"
        >
          <h3 className="text-3xl font-light mb-4">
            Ready to Host or Attend an Event?
          </h3>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Register your venue, manage bookings, or grab tickets for upcoming events — 
            everything is seamless and transparent.
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-xl text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all">
            Explore Venues
          </button>
        </motion.div>
      </main>

   
      <footer className="border-t border-slate-800/60 py-8 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} Ticketing System. Empowering Events Everywhere.
      </footer>
    </div>
  );
}

const features = [
  {
    title: 'Smart Venue Search',
    description:
      'Browse verified venues with filters for capacity, facilities, and location to find your ideal event space.',
    icon: <MapPin size={22} className="text-indigo-400" />,
  },
  {
    title: 'Instant Booking',
    description:
      'View live availability, pricing, and instantly reserve your slot with transparent payment options.',
    icon: <Ticket size={22} className="text-indigo-400" />,
  },
  {
    title: 'Analytics Dashboard',
    description:
      'Gain insights into bookings, visitor statistics, and trends through real-time data visualization.',
    icon: <BarChart3 size={22} className="text-indigo-400" />,
  },
  {
    title: 'Event Management',
    description:
      'Manage events, approvals, and logistics efficiently with an integrated backend control system.',
    icon: <CalendarDays size={22} className="text-indigo-400" />,
  },
  {
    title: 'Collaborative Access',
    description:
      'Enable multiple coordinators or departments to work together with role-based permissions.',
    icon: <Users size={22} className="text-indigo-400" />,
  },
  {
    title: 'Secure and Scalable',
    description:
      'Built with enterprise-grade architecture for reliable performance and data protection.',
    icon: <BarChart3 size={22} className="text-indigo-400" />,
  },
];
