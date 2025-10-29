import React from 'react'
import { getUpcomingEvents } from '../../lib/api'
import EventCard from '../components/card/EventCard'


export default async function EventsPage() {
const events = await getUpcomingEvents()
return (
<section>
<h2 className="title">Upcoming Events</h2>
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
{events.map((e: any) => (
<EventCard key={e.id} event={e} />
))}
</div>
</section>
)
}