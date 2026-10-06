import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import wedding from '../../data/wedding.json'
import { fillNames } from '../../lib/names.ts'
import Opening from '../Opening.tsx'

const { groom, bride } = wedding.opening
const title = fillNames(wedding.title, wedding.opening)
const shareMessage = fillNames(wedding.shareMessage, wedding.opening)

const brand = {
  ornament: wedding.brand.ornament,
}

const data = wedding.opening

describe('Opening', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    })
  })

  it('shows the couple and a link to the program', () => {
    render(
      <Opening
        data={data}
        brand={brand}
        title={title}
        shareMessage={shareMessage}
      />,
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(groom)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(bride)
    expect(
      screen.getByRole('link', { name: data.detailsLabel }),
    ).toHaveAttribute('href', '#program')
  })

  it('uses the native share sheet when the browser provides one', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: share,
    })
    const user = userEvent.setup()
    render(
      <Opening
        data={data}
        brand={brand}
        title={title}
        shareMessage={shareMessage}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Share Invitation ↗' }))

    expect(share).toHaveBeenCalledWith({
      title,
      text: shareMessage,
      url: window.location.href,
    })
  })

  it('leaves the page alone when sharing is cancelled', async () => {
    const user = userEvent.setup()
    const share = vi
      .fn()
      .mockRejectedValue(
        Object.assign(new Error('cancelled'), { name: 'AbortError' }),
      )
    const writeText = vi.spyOn(navigator.clipboard, 'writeText')
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: share,
    })
    render(
      <Opening
        data={data}
        brand={brand}
        title={title}
        shareMessage={shareMessage}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Share Invitation ↗' }))

    expect(writeText).not.toHaveBeenCalled()
  })

  it('copies the page address when sharing is unavailable', async () => {
    const user = userEvent.setup()
    const writeText = vi.spyOn(navigator.clipboard, 'writeText')
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
    })
    render(
      <Opening
        data={data}
        brand={brand}
        title={title}
        shareMessage={shareMessage}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Share Invitation ↗' }))

    expect(writeText).toHaveBeenCalledWith(window.location.href)
  })
})
