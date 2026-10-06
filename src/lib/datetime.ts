const timePattern = /^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/
const datePattern = /^(\d{2})[-/](\d{2})[-/](\d{4})$/

function parts(date: string, time: string) {
  const dayMatch = date.trim().match(datePattern)
  const clockMatch = time.trim().match(timePattern)
  if (!dayMatch || !clockMatch) return null

  const day = Number(dayMatch[1])
  const month = Number(dayMatch[2])
  const year = Number(dayMatch[3])
  let hours = Number(clockMatch[1])
  const minutes = Number(clockMatch[2])
  const meridiem = clockMatch[3].toUpperCase()
  const probe = new Date(Date.UTC(year, month - 1, day))
  const realDay =
    probe.getUTCFullYear() === year &&
    probe.getUTCMonth() === month - 1 &&
    probe.getUTCDate() === day

  if (!realDay || hours < 1 || hours > 12 || minutes > 59) return null

  if (meridiem === 'AM') {
    if (hours === 12) hours = 0
  } else if (hours !== 12) {
    hours += 12
  }

  return { day, month, year, hours, minutes, meridiem }
}

export function toIstIso(date: string, time: string) {
  const parsed = parts(date, time)
  if (!parsed) return null
  const { year, month, day, hours, minutes } = parsed
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:00+05:30`
}

export function formatClock(time: string) {
  const clockMatch = time.trim().match(timePattern)
  if (!clockMatch) return time
  return `${Number(clockMatch[1])}:${clockMatch[2]} ${clockMatch[3].toUpperCase()}`
}

export function formatEventWhen(date: string, time: string) {
  if (!time.trim().match(timePattern)) return time
  const iso = toIstIso(date, time)
  if (!iso) return formatClock(time)
  const weekday = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(iso))
  return `${weekday} · ${formatClock(time)}`
}

export function formatEventDate(date: string) {
  const iso = toIstIso(date, '12:00PM')
  if (!iso) return date
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(iso))
}
