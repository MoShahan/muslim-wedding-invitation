import { useEffect, useState } from 'react'

import type { Wedding } from '../types.ts'

const units = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
] as const

type Remaining = Record<(typeof units)[number]['key'], number>

function remaining(startsAt: string | null): Remaining {
  const start = startsAt ? new Date(startsAt).getTime() : Number.NaN
  if (!Number.isFinite(start)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  const diff = Math.max(0, start - Date.now())
  const totalSeconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

type CountdownProps = {
  data: Wedding['countdown']
  startsAt: string | null
}

export default function Countdown({ data, startsAt }: CountdownProps) {
  const [time, setTime] = useState(() => remaining(startsAt))

  useEffect(() => {
    const timer = window.setInterval(() => setTime(remaining(startsAt)), 1000)
    return () => window.clearInterval(timer)
  }, [startsAt])

  return (
    <section className="countdown band" id="countdown">
      <p className="count-icon" aria-hidden="true">
        ⏳
      </p>
      <p className="eyebrow">{data.eyebrow}</p>
      <h2>{data.heading}</h2>
      <div className="count-grid">
        {units.map((unit) => (
          <article className="count-card" key={unit.key}>
            <p className="count-value" key={time[unit.key]}>
              {String(time[unit.key]).padStart(2, '0')}
            </p>
            <p className="eyebrow">{unit.label}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
