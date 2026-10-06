import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from '../App.tsx'
import wedding from '../data/wedding.json'
import { fillNames } from '../lib/names.ts'
import { mockMatchMedia } from '../test/matchMedia.ts'

const invitation = fillNames(wedding, wedding.opening)

describe('App', () => {
  it('renders the invitation from the JSON file and applies its theme', () => {
    render(<App />)

    expect(document.title).toBe(invitation.title)
    expect(document.body.textContent).not.toContain('{GroomName}')
    expect(document.body.textContent).not.toContain('{BrideName}')
    expect(document.body.textContent).not.toContain("{Groom's Dad}")
    expect(document.body.textContent).not.toContain("{Groom's Mom}")
    expect(document.body.textContent).not.toContain("{Bride's Mom}")
    expect(document.body.textContent).not.toContain("{Bride's Dad}")
    expect(document.body.textContent).not.toContain('{Year}')
    expect(document.documentElement.style.getPropertyValue('--bg')).toBe(
      wedding.theme.bg,
    )
    expect(document.documentElement.style.getPropertyValue('--surface')).toBe(
      wedding.theme.surface,
    )
    expect(document.documentElement.style.getPropertyValue('--text')).toBe(
      wedding.theme.text,
    )
    expect(document.documentElement.style.getPropertyValue('--muted')).toBe(
      wedding.theme.muted,
    )
    expect(document.documentElement.style.getPropertyValue('--accent')).toBe(
      wedding.theme.accent,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      wedding.opening.groom,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      wedding.opening.bride,
    )
    expect(
      screen.getByRole('heading', { name: wedding.celebration.heading }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: wedding.venue.name }),
    ).toBeInTheDocument()
    expect(screen.getByText(invitation.footer)).toBeInTheDocument()
    expect(
      document.querySelector('link[rel="icon"]')?.getAttribute('href'),
    ).toBe(wedding.brand.favicon)
    expect(
      document
        .querySelector('meta[property="og:image"]')
        ?.getAttribute('content'),
    ).toBe(new URL(wedding.brand.shareImage, window.location.origin).href)
    expect(screen.getByRole('heading', { level: 1 })).not.toHaveClass(
      'is-visible',
    )
  })

  it('shows reveal content immediately when motion is reduced', () => {
    mockMatchMedia(true)

    render(<App />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('is-visible')
  })
})
