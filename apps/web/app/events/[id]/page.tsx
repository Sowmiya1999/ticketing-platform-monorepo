'use client'

import React, { useEffect, useState } from 'react'
import { notFound, useRouter } from 'next/navigation'
import BookingForm from '../../components/BookingForm'
import { getEventById } from '../../../lib/api'

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter()
  const [event, setEvent] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState(Number(process.env.BOOKING_TIMER) || 120) 
  const [bookingStarted, setBookingStarted] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await getEventById(id)
       if (res) {
        setEvent(res)
      } else {
        notFound()
      }
    }

    fetchEvent()
  }, [id])

  useEffect(() => {
    if (bookingStarted) return
    if (timeLeft <= 0) {
      router.back()
      return
    }

    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, bookingStarted, router])

  if (!event) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-md z-50">
        <div className="w-14 h-14 border-4 border-t-transparent border-gradient-to-r from-blue-600 to-orange-400 rounded-full animate-spin"></div>
      </div>
    )
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const { currentPrice, totalTickets, bookedTickets, date, name, venue, description } = event
  const remainingTickets: number = totalTickets - bookedTickets
 

  return (
    <div className="relative space-y-6">
    
      <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-orange-400 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium">
        ⏳ {minutes}:{seconds.toString().padStart(2, '0')}
      </div>

      <div className="flex justify-center">
        <div className="bg-white p-4 rounded shadow w-full max-w-2xl">
          <h1 className="text-2xl font-semibold">{name}</h1>
        <p className="text-md text-gray-600">
          {new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata",
          }).format(new Date(date))}{" "}
          </p>
          <p className="mt-2 text-sm">{description}</p>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-white p-4 rounded shadow w-full max-w-2xl">
          <BookingForm
            event={event}
            initialPrice={currentPrice}
            onBookingStart={() => setBookingStarted(true)}
          />
        </div>
      </div>
    </div>
  )
}
