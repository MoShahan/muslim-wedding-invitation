import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import wedding from '../../data/wedding.json'
import { fillNames } from '../../lib/names.ts'
import Families from '../Families.tsx'

const families = fillNames(wedding.families, wedding.opening)

describe('Families', () => {
  it('renders each family card', () => {
    render(<Families data={families} />)

    expect(
      screen.getByRole('heading', { name: families.heading }),
    ).toBeInTheDocument()
    for (const family of families.items) {
      expect(screen.getByText(family.eyebrow)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: family.parents }),
      ).toBeInTheDocument()
      expect(screen.getByText(family.line)).toBeInTheDocument()
      expect(screen.getByText(family.name)).toBeInTheDocument()
    }
  })
})
