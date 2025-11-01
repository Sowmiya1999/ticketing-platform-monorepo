'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getEventById } from '../../../lib/api';

interface EventType {
  id: number;
  name: string;
  date: string;
  venue: string;
  basePrice: number;
  currentPrice?: number;
  totalTickets: number;
  bookedTickets: number;
}

interface EventCardProps {
  event: EventType;
}

export default function EventCard({ event }: EventCardProps) {
  const [currentEvent, setCurrentEvent] = useState<EventType>(event);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const fetchUpdatedEvent = async () => {
      try {
        console.log('Fetching updated event', event.id);
        const res = await getEventById(event.id);
        if (res && mounted) {
          setCurrentEvent(res);
        }
      } catch (err) {
        console.error('Error updating event data:', err);
      }
    };

    fetchUpdatedEvent();
    const interval = setInterval(fetchUpdatedEvent, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [event.id]);

  const handleViewClick = () => {
    setLoading(true);
    router.push(`/events/${currentEvent.id}`);
  };

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    }).format(new Date(dateStr));

  return (
    <article className="p-[2px] rounded-xl bg-gradient-to-r from-blue-600 to-orange-400 hover:shadow-lg transition-shadow relative">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/20 cursor-not-allowed">
          <div className="w-16 h-16 border-4 border-transparent border-t-blue-600 border-r-orange-400 rounded-full animate-spin"></div>
        </div>
      )}

      <div className="bg-white rounded-xl p-4 shadow flex flex-col space-y-2">
        <h3 className="title text-lg font-semibold">{currentEvent.name}</h3>
        <p className="text-md text-gray-600">
          {formatDate(currentEvent.date)} • {currentEvent.venue}
        </p>

        <div className="mt-2 flex items-center justify-between text-sm text-gray-800">
          <div>
            Current Price: ₹{currentEvent.currentPrice ?? currentEvent.basePrice}
          </div>
          <div>
            Tickets Left: {currentEvent.totalTickets - currentEvent.bookedTickets}
          </div>
        </div>

        <button
          onClick={handleViewClick}
          className="!text-sm !mt-3 title self-start text-blue-600 hover:underline"
          disabled={loading}
        >
          View
        </button>
      </div>
    </article>
  );
}
