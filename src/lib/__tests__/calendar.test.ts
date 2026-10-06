import { afterEach, describe, expect, it, vi } from 'vitest'

import wedding from '../../data/wedding.json'
import { copyText, downloadIcs, googleCalendarUrl } from '../calendar.ts'
import { toIstIso } from '../datetime.ts'

const calendar = {
  title: 'Nikah, reception; please come',
  date: wedding.calendar.date,
  time: wedding.calendar.time,
  endDate: wedding.calendar.endDate,
  endTime: wedding.calendar.endTime,
  details: 'Ceremony\nthen dinner',
  location: 'Hall\\A',
}

function utcStamp(iso: string | null) {
  if (!iso) throw new Error('Expected a readable date and time')
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
}

describe('googleCalendarUrl', () => {
  it('builds a Google Calendar template in UTC', () => {
    const href = googleCalendarUrl(calendar)
    if (!href) throw new Error('Expected a calendar link')
    const url = new URL(href)

    expect(url.origin + url.pathname).toBe(
      'https://calendar.google.com/calendar/render',
    )
    expect(url.searchParams.get('action')).toBe('TEMPLATE')
    expect(url.searchParams.get('text')).toBe(calendar.title)
    expect(url.searchParams.get('dates')).toBe(
      `${utcStamp(toIstIso(calendar.date, calendar.time))}/${utcStamp(toIstIso(calendar.endDate, calendar.endTime))}`,
    )
    expect(url.searchParams.get('details')).toBe(calendar.details)
    expect(url.searchParams.get('location')).toBe(calendar.location)
  })

  it('returns nothing when the date or time cannot be read', () => {
    expect(googleCalendarUrl({ ...calendar, date: 'hello' })).toBeNull()
  })
})

describe('downloadIcs', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('downloads an escaped calendar file', async () => {
    let file: Blob | undefined
    vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
      if (!(blob instanceof Blob)) throw new Error('Expected a calendar file')
      file = blob
      return 'blob:wedding'
    })
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {})

    downloadIcs(calendar)

    expect(click).toHaveBeenCalledOnce()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:wedding')
    if (!file) throw new Error('Calendar file was not created')
    const body = await file.text()
    expect(body).toContain('BEGIN:VCALENDAR')
    expect(body).toContain('PRODID:-//Wedding Invitation//EN')
    expect(body).toContain(
      `DTSTART:${utcStamp(toIstIso(calendar.date, calendar.time))}`,
    )
    expect(body).toContain(
      `DTEND:${utcStamp(toIstIso(calendar.endDate, calendar.endTime))}`,
    )
    expect(body).toContain('SUMMARY:Nikah\\, reception\\; please come')
    expect(body).toContain('DESCRIPTION:Ceremony\\nthen dinner')
    expect(body).toContain('LOCATION:Hall\\\\A')
    expect(body).toContain('END:VCALENDAR')
  })
})

describe('copyText', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('writes to the clipboard when it is available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    await expect(copyText(wedding.venue.name)).resolves.toBe(true)
    expect(writeText).toHaveBeenCalledWith(wedding.venue.name)
  })

  it('falls back to a hidden textarea when the clipboard rejects', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    const execCommand = vi.fn().mockReturnValue(true)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    document.execCommand = execCommand

    await expect(copyText('the address')).resolves.toBe(true)
    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(document.querySelector('textarea')).toBeNull()
  })

  it('reports failure when both copy methods fail', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    })
    document.execCommand = vi.fn().mockReturnValue(false)

    await expect(copyText('the address')).resolves.toBe(false)
  })
})
