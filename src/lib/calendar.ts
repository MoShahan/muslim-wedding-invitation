import { toIstIso } from './datetime.ts'

import type { CalendarDetails } from '../types.ts'

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.left = '-9999px'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  }
}

function stamp(iso: string) {
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
}

function calendarRange(calendar: CalendarDetails) {
  const start = toIstIso(calendar.date, calendar.time)
  const end = toIstIso(calendar.endDate, calendar.endTime)
  if (!start || !end) return null
  return { start: stamp(start), end: stamp(end) }
}

export function googleCalendarUrl(calendar: CalendarDetails) {
  const range = calendarRange(calendar)
  if (!range) return null
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: calendar.title,
    dates: `${range.start}/${range.end}`,
    details: calendar.details,
    location: calendar.location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function icsEscape(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

export function downloadIcs(calendar: CalendarDetails) {
  const range = calendarRange(calendar)
  if (!range) return
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//EN',
    'BEGIN:VEVENT',
    `DTSTART:${range.start}`,
    `DTEND:${range.end}`,
    `SUMMARY:${icsEscape(calendar.title)}`,
    `DESCRIPTION:${icsEscape(calendar.details)}`,
    `LOCATION:${icsEscape(calendar.location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const file = new Blob([body], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = 'wedding.ics'
  link.click()
  URL.revokeObjectURL(url)
}
