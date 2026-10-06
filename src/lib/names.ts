const tokens = {
  '{GroomName}': 'groom',
  '{BrideName}': 'bride',
  "{Groom's Dad}": 'groomDad',
  "{Groom's Mom}": 'groomMom',
  "{Bride's Mom}": 'brideMom',
  "{Bride's Dad}": 'brideDad',
} as const

export type People = Record<(typeof tokens)[keyof typeof tokens], string>

export function fillNames<T>(value: T, people: People): T {
  if (typeof value === 'string') {
    let filled: string = value
    for (const [token, key] of Object.entries(tokens)) {
      filled = filled.replaceAll(token, people[key as keyof People])
    }
    return filled.replaceAll('{Year}', String(new Date().getFullYear())) as T
  }
  if (Array.isArray(value)) {
    return value.map((item) => fillNames(item, people)) as T
  }
  if (value !== null && typeof value === 'object') {
    const filled: Record<string, unknown> = {}
    for (const [key, item] of Object.entries(value)) {
      filled[key] = fillNames(item, people)
    }
    return filled as T
  }
  return value
}
