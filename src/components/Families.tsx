import type { Wedding } from '../types.ts'

type FamiliesProps = {
  data: Wedding['families']
}

export default function Families({ data }: FamiliesProps) {
  return (
    <section className="families band" id="families">
      <h2 className="reveal">{data.heading}</h2>
      <div className="family-grid">
        {data.items.map((family) => (
          <article className="family-card reveal" key={family.name}>
            <p className="eyebrow">{family.eyebrow}</p>
            <h3>{family.parents}</h3>
            <p>{family.line}</p>
            <p className="family-name">{family.name}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
