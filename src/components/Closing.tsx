import type { Wedding } from '../types.ts'

type ClosingProps = {
  closing: Wedding['closing']
}

function headingParts(heading: string) {
  const splitAt = heading.toLowerCase().indexOf(' with ')
  if (splitAt === -1) return { lead: heading, rest: '' }
  return {
    lead: heading.slice(0, splitAt),
    rest: heading.slice(splitAt + 1),
  }
}

export default function Closing({ closing }: ClosingProps) {
  const { lead, rest } = headingParts(closing.heading)

  return (
    <section className="duas">
      <div className="closing reveal">
        <p className="closing-mark" aria-hidden="true">
          <svg className="closing-mark-icon" viewBox="0 0 48 48">
            <rect
              x="16"
              y="16"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              transform="rotate(45 24 24)"
            />
            <rect
              x="18"
              y="18"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        </p>
        <p className="eyebrow">{closing.eyebrow}</p>
        <h2>
          {lead}
          {rest ? <em>{rest}</em> : null}
        </h2>
        <p className="arabic">{closing.arabic}</p>
        <p className="translation">{closing.translation}</p>
      </div>
    </section>
  )
}
