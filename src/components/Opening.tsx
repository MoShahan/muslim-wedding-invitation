import { copyText } from '../lib/calendar.ts'

import type { Wedding } from '../types.ts'

type OpeningProps = {
  data: Wedding['opening']
  brand: Pick<Wedding['brand'], 'ornament'>
  title: string
  shareMessage: string
}

export default function Opening({
  data,
  brand,
  title,
  shareMessage,
}: OpeningProps) {
  async function share() {
    const payload = {
      title,
      text: shareMessage,
      url: window.location.href,
    }
    if (navigator.share) {
      try {
        await navigator.share(payload)
        return
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
      }
    }
    await copyText(window.location.href)
  }

  return (
    <section className="opening" id="top">
      <img className="ornament reveal" src={brand.ornament} alt="" />
      <p className="arabic reveal">{data.bismillah}</p>
      <p className="translation reveal">{data.bismillahTranslation}</p>
      <p className="lead reveal">{data.lead}</p>
      <p className="invite reveal">{data.invite}</p>
      <h1 className="name-plate reveal">
        <span>{data.groom}</span>
        <span className="amp">&</span>
        <span>{data.bride}</span>
      </h1>
      <p className="closing-line reveal">{data.closing}</p>
      <blockquote className="verse reveal">
        <p className="arabic">{data.verseArabic}</p>
        <p>{data.verseEnglish}</p>
      </blockquote>
      <div className="opening-actions reveal">
        <a className="button gold" href="#program">
          {data.detailsLabel}
        </a>
        <button className="button" type="button" onClick={share}>
          Share Invitation ↗
        </button>
      </div>
    </section>
  )
}
