import { describe, expect, it } from 'vitest'

import { formatEventDate, formatEventWhen, toIstIso } from '../datetime.ts'

describe('toIstIso', () => {
  it('reads a day-month-year date and a 12-hour time as India time', () => {
    expect(toIstIso('24-10-2026', '11:00AM')).toBe('2026-10-24T11:00:00+05:30')
    expect(toIstIso('24/10/2026', '11:30 AM')).toBe('2026-10-24T11:30:00+05:30')
    expect(toIstIso('24-10-2026', '12:00AM')).toBe('2026-10-24T00:00:00+05:30')
    expect(toIstIso('24-10-2026', '12:00PM')).toBe('2026-10-24T12:00:00+05:30')
    expect(toIstIso('24-10-2026', '03:00pm')).toBe('2026-10-24T15:00:00+05:30')
  })

  it('writes the program lines from that date and time', () => {
    expect(formatEventWhen('24-10-2026', '11:00AM')).toBe('Saturday · 11:00 AM')
    expect(formatEventWhen('24-10-2026', 'Following the Nikah')).toBe(
      'Following the Nikah',
    )
    expect(formatEventDate('24-10-2026')).toBe('24 October 2026')
  })

  it('leaves the page usable when the date or time cannot be read', () => {
    expect(toIstIso('32-13-2026', '11:00AM')).toBeNull()
    expect(toIstIso('10-10-2026', '99:00AM')).toBeNull()
    expect(toIstIso('hello', '11:00AM')).toBeNull()
    expect(formatEventWhen('hello', '11:00AM')).toBe('11:00 AM')
    expect(formatEventWhen('hello', 'Following the Nikah')).toBe(
      'Following the Nikah',
    )
    expect(formatEventDate('hello')).toBe('hello')
  })
})
