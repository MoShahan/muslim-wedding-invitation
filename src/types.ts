import wedding from './data/wedding.json'

export type Wedding = typeof wedding

export type CalendarDetails = Pick<
  Wedding['calendar'],
  'title' | 'date' | 'time' | 'endDate' | 'endTime' | 'details' | 'location'
>

export type ProgramEvent = {
  number: string
  eyebrow: string
  title: string
  time: string
  place: string
}
