import { formatEventWhen } from '../lib/datetime.ts'

import type { ProgramEvent, Wedding } from '../types.ts'

type ProgramProps = {
  celebration: Wedding['celebration']
  events: ProgramEvent[]
  date: string
}

export default function Program({ celebration, events, date }: ProgramProps) {
  return (
    <section className="program" id="program">
      <p className="eyebrow reveal">{celebration.eyebrow}</p>
      <h2 className="reveal">{celebration.heading}</h2>
      <p className="section-sub reveal">{celebration.sub}</p>
      <div className="event-grid">
        {events.map((event) => (
          <article className="card reveal" key={event.number}>
            <p className="event-number">{event.number}</p>
            <p className="eyebrow">{event.eyebrow}</p>
            <h3>{event.title}</h3>
            <p className="when">{formatEventWhen(date, event.time)}</p>
            <p className="place">{event.place}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
