import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import wedding from '../../data/wedding.json'
import { toIstIso } from '../../lib/datetime.ts'
import Countdown from '../Countdown.tsx'

const data = wedding.countdown
const startsAt = toIstIso(wedding.calendar.date, wedding.calendar.time)
if (!startsAt) throw new Error('Calendar date and time need to be readable')

const day = 24 * 60 * 60 * 1000
const ceremony = new Date(startsAt).getTime()
const dayBefore = new Date(ceremony - day)
const dayAfter = new Date(ceremony + day)

function value(label: string) {
  return screen.getByText(label).previousElementSibling?.textContent
}

describe('Countdown', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the time remaining until the ceremony', () => {
    vi.useFakeTimers()
    vi.setSystemTime(dayBefore)

    render(<Countdown data={data} startsAt={startsAt} />)

    expect(screen.getByText('⏳')).toBeInTheDocument()
    expect(screen.getByText(data.eyebrow)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: data.heading }),
    ).toBeInTheDocument()
    expect(value('Days')).toBe('01')
    expect(value('Hours')).toBe('00')
    expect(value('Minutes')).toBe('00')
    expect(value('Seconds')).toBe('00')
  })

  it('ticks once per second', () => {
    vi.useFakeTimers()
    vi.setSystemTime(dayBefore)
    render(<Countdown data={data} startsAt={startsAt} />)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(value('Days')).toBe('00')
    expect(value('Hours')).toBe('23')
    expect(value('Minutes')).toBe('59')
    expect(value('Seconds')).toBe('59')
  })

  it('stays at zero after the ceremony has started', () => {
    vi.useFakeTimers()
    vi.setSystemTime(dayAfter)

    render(<Countdown data={data} startsAt={startsAt} />)

    expect(value('Days')).toBe('00')
    expect(value('Hours')).toBe('00')
    expect(value('Minutes')).toBe('00')
    expect(value('Seconds')).toBe('00')
  })

  it('stays at zero when the ceremony time cannot be read', () => {
    render(<Countdown data={data} startsAt={null} />)

    expect(value('Days')).toBe('00')
    expect(value('Hours')).toBe('00')
    expect(value('Minutes')).toBe('00')
    expect(value('Seconds')).toBe('00')
  })
})
