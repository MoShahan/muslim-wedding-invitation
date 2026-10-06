import { useState } from 'react'

import { copyText, downloadIcs, googleCalendarUrl } from '../lib/calendar.ts'

import type { CalendarDetails, Wedding } from '../types.ts'

type VenueProps = {
  venue: Wedding['venue']
  calendar: CalendarDetails &
    Pick<Wedding['calendar'], 'googleLabel' | 'icsLabel'>
}

export default function Venue({ venue, calendar }: VenueProps) {
  const [copied, setCopied] = useState(false)
  const address = [venue.name, ...venue.lines].join('\n')
  const calendarUrl = googleCalendarUrl(calendar)

  async function copyAddress() {
    const ok = await copyText(address.replaceAll('\n', ', '))
    if (!ok) return
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="venue-wrap" id="venue">
      <article className="card venue-card reveal">
        <p className="pin" aria-hidden="true">
          <svg className="pin-icon" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
            />
          </svg>
        </p>
        <p className="eyebrow">{venue.eyebrow}</p>
        <h2>{venue.name}</h2>
        {venue.lines.map((line) => (
          <p key={line} className="address-line">
            {line}
          </p>
        ))}
        <div className="venue-actions">
          <a
            className="button gold"
            href={venue.mapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            {venue.mapsLabel}
          </a>
          <button className="button" type="button" onClick={copyAddress}>
            {copied ? 'Address copied' : venue.copyLabel}
          </button>
        </div>
        <div className="venue-actions">
          {calendarUrl ? (
            <a
              className="button"
              href={calendarUrl}
              target="_blank"
              rel="noreferrer"
            >
              {calendar.googleLabel}
            </a>
          ) : (
            <button className="button" type="button" disabled>
              {calendar.googleLabel}
            </button>
          )}
          <button
            className="button"
            type="button"
            onClick={() => downloadIcs(calendar)}
          >
            {calendar.icsLabel}
          </button>
        </div>
      </article>
    </section>
  )
}
