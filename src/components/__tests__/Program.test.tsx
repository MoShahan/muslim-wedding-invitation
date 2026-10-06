import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import wedding from '../../data/wedding.json'
import { formatEventWhen } from '../../lib/datetime.ts'
import Program from '../Program.tsx'

describe('Program', () => {
  it('renders the celebration and each event', () => {
    render(
      <Program
        celebration={wedding.celebration}
        events={wedding.events}
        date={wedding.calendar.date}
      />,
    )

    expect(
      screen.getByRole('heading', { name: wedding.celebration.heading }),
    ).toBeInTheDocument()
    expect(screen.getByText(wedding.celebration.sub)).toBeInTheDocument()
    for (const event of wedding.events) {
      expect(
        screen.getByRole('heading', { name: event.title }),
      ).toBeInTheDocument()
      expect(
        screen.getByText(formatEventWhen(wedding.calendar.date, event.time)),
      ).toBeInTheDocument()
      expect(screen.getByText(event.place)).toBeInTheDocument()
    }
  })
})
