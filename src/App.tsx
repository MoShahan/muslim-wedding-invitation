import { useEffect } from 'react'

import Closing from './components/Closing.tsx'
import Countdown from './components/Countdown.tsx'
import Families from './components/Families.tsx'
import Opening from './components/Opening.tsx'
import Program from './components/Program.tsx'
import Venue from './components/Venue.tsx'
import wedding from './data/wedding.json'
import { toIstIso } from './lib/datetime.ts'
import { fillNames } from './lib/names.ts'

import type { Wedding } from './types.ts'

const invitation = fillNames(wedding, wedding.opening)

function applyTheme(theme: Wedding['theme']) {
  const root = document.documentElement
  root.style.setProperty('--bg', theme.bg)
  root.style.setProperty('--surface', theme.surface)
  root.style.setProperty('--text', theme.text)
  root.style.setProperty('--muted', theme.muted)
  root.style.setProperty('--accent', theme.accent)
}

applyTheme(invitation.theme)

function upsertMeta(
  attribute: 'name' | 'property',
  key: string,
  content: string,
) {
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function upsertLink(rel: string, href: string, type?: string) {
  let tag = document.head.querySelector(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
  if (type) tag.setAttribute('type', type)
}

function ceremonyStart(calendar: Wedding['calendar']) {
  return toIstIso(calendar.date, calendar.time)
}

export default function App() {
  useEffect(() => {
    const { brand } = invitation
    const shareImage = new URL(brand.shareImage, window.location.origin).href
    document.title = invitation.title
    upsertLink('icon', brand.favicon, 'image/jpeg')
    upsertLink('apple-touch-icon', brand.appleTouchIcon)
    upsertMeta('property', 'og:title', invitation.title)
    upsertMeta('property', 'og:description', invitation.shareMessage)
    upsertMeta('property', 'og:image', shareImage)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:image', shareImage)
  }, [])

  useEffect(() => {
    const nodes = [...document.querySelectorAll('.reveal')]
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const show = (node: Element) => node.classList.add('is-visible')
    if (reduced) {
      nodes.forEach(show)
      return
    }

    const inView = (node: Element) => {
      const rect = node.getBoundingClientRect()
      const height = window.innerHeight
      return rect.height > 0 && rect.top < height * 0.92 && rect.bottom > 0
    }
    const paint = () => nodes.forEach((node) => inView(node) && show(node))
    paint()
    const frame = window.requestAnimationFrame(paint)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) show(entry.target)
        })
      },
      { threshold: 0 },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <main>
        <Opening
          data={invitation.opening}
          brand={invitation.brand}
          title={invitation.title}
          shareMessage={invitation.shareMessage}
        />
        <Families data={invitation.families} />
        <div className="celebration-band">
          <Program
            celebration={invitation.celebration}
            events={invitation.events}
            date={invitation.calendar.date}
          />
          <Venue venue={invitation.venue} calendar={invitation.calendar} />
        </div>
        <Countdown
          data={invitation.countdown}
          startsAt={ceremonyStart(invitation.calendar)}
        />
        <Closing closing={invitation.closing} />
      </main>
      <footer className="site-footer">
        <img
          className="footer-ornament"
          src={invitation.brand.ornament}
          alt=""
        />
        <p>{invitation.footer}</p>
      </footer>
    </>
  )
}
