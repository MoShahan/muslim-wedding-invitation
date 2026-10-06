import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import wedding from '../../data/wedding.json'
import { googleCalendarUrl } from '../../lib/calendar.ts'
import Venue from '../Venue.tsx'

const venue = wedding.venue
const calendar = wedding.calendar
const address = [venue.name, ...venue.lines].join(', ')

describe('Venue', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('links to maps and Google Calendar', () => {
    render(<Venue venue={venue} calendar={calendar} />)

    expect(
      screen.getByRole('heading', { name: venue.name }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: venue.mapsLabel })).toHaveAttribute(
      'href',
      venue.mapsUrl,
    )
    const calendarUrl = googleCalendarUrl(calendar)
    if (!calendarUrl)
      throw new Error('Calendar date and time need to be readable')
    expect(
      screen.getByRole('link', { name: calendar.googleLabel }),
    ).toHaveAttribute('href', calendarUrl)
    for (const line of venue.lines) {
      expect(screen.getByText(line)).toBeInTheDocument()
    }
  })

  it('confirms when the address is copied, then restores the label', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
    render(<Venue venue={venue} calendar={calendar} />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: venue.copyLabel }))
    })

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(address)
    expect(
      screen.getByRole('button', { name: 'Address copied' }),
    ).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(
      screen.getByRole('button', { name: venue.copyLabel }),
    ).toBeInTheDocument()
  })

  it('keeps the copy label when copying fails', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    })
    document.execCommand = vi.fn().mockReturnValue(false)
    render(<Venue venue={venue} calendar={calendar} />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: venue.copyLabel }))
    })

    expect(
      screen.getByRole('button', { name: venue.copyLabel }),
    ).toBeInTheDocument()
  })

  it('downloads an ics file for Apple and Outlook', () => {
    let download = ''
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:wedding')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(
      function onClick(this: HTMLAnchorElement) {
        download = this.download
      },
    )
    render(<Venue venue={venue} calendar={calendar} />)

    fireEvent.click(screen.getByRole('button', { name: calendar.icsLabel }))

    expect(download).toBe('wedding.ics')
  })
})
