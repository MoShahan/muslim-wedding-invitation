import { describe, expect, it } from 'vitest'

import wedding from '../../data/wedding.json'
import { fillNames } from '../names.ts'

const people = wedding.opening

describe('fillNames', () => {
  it('replaces name tokens and leaves other text alone', () => {
    expect(
      fillNames(
        'You are invited to the wedding of {GroomName} & {BrideName}.',
        people,
      ),
    ).toBe(
      `You are invited to the wedding of ${people.groom} & ${people.bride}.`,
    )
    expect(
      fillNames(
        "Mr. {Groom's Dad} & Mrs. {Groom's Mom}, and Mr. {Bride's Dad} & Mrs. {Bride's Mom}",
        people,
      ),
    ).toBe(
      `Mr. ${people.groomDad} & Mrs. ${people.groomMom}, and Mr. ${people.brideDad} & Mrs. ${people.brideMom}`,
    )
    expect(fillNames('Please join us.', people)).toBe('Please join us.')
    expect(fillNames('families · {Year}', people)).toBe(
      `families · ${new Date().getFullYear()}`,
    )
  })

  it('fills tokens inside nested invitation data', () => {
    expect(
      fillNames(
        {
          title: '{GroomName} & {BrideName}',
          names: ["{Groom's Dad}", "{Bride's Mom}"],
        },
        people,
      ),
    ).toEqual({
      title: `${people.groom} & ${people.bride}`,
      names: [people.groomDad, people.brideMom],
    })
  })
})
