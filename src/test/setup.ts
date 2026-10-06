import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

import { mockMatchMedia } from './matchMedia.ts'

class FakeIntersectionObserver {
  observe() {}

  unobserve() {}

  disconnect() {}

  takeRecords() {
    return []
  }
}

window.IntersectionObserver =
  FakeIntersectionObserver as unknown as typeof IntersectionObserver
mockMatchMedia(false)

afterEach(() => {
  cleanup()
  localStorage.clear()
  mockMatchMedia(false)
})
