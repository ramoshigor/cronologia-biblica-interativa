import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, BookOpenText, Clock3, MapPin } from 'lucide-react'
import { Breadcrumbs, DateBadge, ReferencePills, SectionHeading } from '../components/Shared'
import { EditorialImage } from '../components/EditorialImage'
import { editorialImages, imageForEvent } from '../media/manifest'
import { books, events, persons, places } from '../repositories/catalogRepository'
import type { Person } from '../types'

const phases = [
  { id: 'all', label: 'Todas as etapas' },
  { id: 'beginning', label: 'Nascimento e batismo' },
  { id: 'ministry', label: 'Ministério' },
  { id: 'passion', label: 'Paixão e ressurreição' },
] as const

export const jesusJourney = [
  { id: 'birth-jesus', phase: 'beginning' },
  { id: 'jesus-baptism', phase: 'beginning' },
  { id: 'first-disciples', phase: 'ministry' },
  { id: 'sermon-mount', phase: 'ministry' },
  { id: 'last-supper', phase: 'passion' },
  { id: 'crucifixion', phase: 'passion' },
  { id: 'empty-tomb', phase: 'passion' },
  { id: 'thomas-risen', phase: 'passion' },
] as const

export default function JesusPage({ person }: { person: Person }) {
  const [phase, setPhase] = useState<(typeof phases)[number]['id']>('all')
  const journey = jesusJourney.map((step, index) => ({ ...step, number: index + 1, event: events.find((event) => event.id === step.id) })).filter((step) => step.event && (phase === 'all' || step.phase === phase))
  const gospels = books.filter((book) => person.bookIds.includes(book.id))
  const relatedPlaces = places.filter((place) => person.placeIds.includes(place.id))
  const companions = persons.filter((item) => ['mary', 'john-baptist', 'peter', 'john-apostle', 'mary-magdalene', 'thomas'].includes(item.id))

  return <article className="detail-page jesus-page">
    <Breadcrumbs items={[{ label: 'Início', href: '/' }, { label: 'Personagens', href: '/explorar?tab=personagens' }, { label: person.title }]} />
    <header className="jesus-hero">
      <figure className="jesus-hero-image"><EditorialImage image={editorialImages.jesusTeaching} eager /><figcaption>Ilustração interpretativa · Ensino no monte</figcaption></figure>
      <div className="jesus-hero-copy"><span className="eyebrow">A VIDA DE JESUS NOS EVANGELHOS</span><h1>{person.title}</h1><p>{person.shortDescription}</p><DateBadge label={person.dateLabel} type={person.dateType} /><div className="jesus-hero-actions"><a href="#momentos-de-jesus" className="button button-dark">Percorrer sua história <ArrowRight size={16} /></a><Link to="/linha-do-tempo?period=jesus" className="text-link"><Clock3 size={16} /> Abrir cronologia</Link></div></div>
    </header>
    <nav className="jesus-section-nav" aria-label="Nesta página"><a href="#sobre-jesus">Visão geral</a><a href="#momentos-de-jesus">Momentos principais</a><a href="#evangelhos-de-jesus">Os quatro Evangelhos</a></nav>

    <div className="detail-layout"><div className="detail-main-column">
      <section className="content-card jesus-overview" id="sobre-jesus"><SectionHeading eyebrow="VISÃO GERAL" title="Uma história que conecta os Evangelhos" /><p className="body-copy">{person.description}</p><div className="jesus-overview-facts"><span><strong>Belém</strong>Nascimento</span><span><strong>Galileia</strong>Ministério público</span><span><strong>Jerusalém</strong>Paixão e ressurreição</span></div></section>

      <section className="content-card jesus-journey" id="momentos-de-jesus"><SectionHeading eyebrow="PERCURSO VISUAL" title="A vida de Jesus, em etapas" description="Escolha uma etapa para consultar os acontecimentos e suas passagens bíblicas." />
        <div className="jesus-phase-filters" role="group" aria-label="Etapas da vida de Jesus">{phases.map((item) => <button key={item.id} type="button" aria-pressed={phase === item.id} onClick={() => setPhase(item.id)}>{item.label}</button>)}</div>
        <p className="jesus-chronology-note">A sequência orienta a leitura da narrativa. As datas são aproximadas; a ordem de alguns episódios varia entre os Evangelhos.</p>
        <p className="sr-only" role="status" aria-live="polite">{journey.length} acontecimentos nesta etapa.</p>
        <ol className="jesus-journey-grid">{journey.map(({ event, number }) => event && <li key={event.id} value={number}>
          <article className="jesus-moment-card"><Link to={`/evento/${event.slug}`} className="jesus-moment-image" tabIndex={-1} aria-hidden="true">{imageForEvent[event.id] && <EditorialImage image={imageForEvent[event.id]!} />}<span className="jesus-moment-number">{String(number).padStart(2, '0')}</span></Link>
            <div className="jesus-moment-copy"><span className="jesus-moment-date">{event.dateLabel}</span><h3><Link to={`/evento/${event.slug}`}>{event.title}</Link></h3><p>{event.shortDescription}</p><ReferencePills references={event.references.slice(0, 2)} /><Link to={`/evento/${event.slug}`} className="text-link" aria-label={`Ler contexto: ${event.title}`}>Ler contexto <ArrowRight size={14} /></Link></div>
          </article>
        </li>)}</ol><p className="jesus-art-note">As cenas são interpretações artísticas das passagens.</p>
      </section>

      <section className="content-card" id="evangelhos-de-jesus"><SectionHeading eyebrow="LEITURA NOS EVANGELHOS" title="Quatro relatos, uma história" description="Consulte o contexto de cada livro, sua autoria e as datas propostas para a composição." /><div className="jesus-gospel-grid">{gospels.map((book, index) => <Link key={book.id} to={`/livro/${book.slug}`} className="jesus-gospel-card"><span className="jesus-gospel-index">0{index + 1}</span><span><strong>{book.title}</strong><small>{book.authorshipLabel}</small></span><ArrowRight size={16} /></Link>)}</div></section>
      <section className="content-card"><SectionHeading eyebrow="CONSULTA BÍBLICA" title="Referências para começar" /><ReferencePills references={person.references} /></section>
    </div><aside className="detail-side-column jesus-side">
      <section className="source-card"><span className="eyebrow">LUGARES DA NARRATIVA</span>{relatedPlaces.map((place) => <Link key={place.id} to={`/lugar/${place.slug}`} className="source-row"><MapPin size={16} /><span><strong>{place.title}</strong><small>{place.shortDescription}</small></span><ArrowRight size={13} /></Link>)}</section>
      <section className="source-card"><span className="eyebrow">PESSOAS AO REDOR DE JESUS</span>{companions.map((item) => <Link key={item.id} to={`/personagem/${item.slug}`} className="source-row"><span className="jesus-companion-initial" aria-hidden="true">{item.title.charAt(0)}</span><span><strong>{item.title}</strong><small>{item.role}</small></span><ArrowRight size={13} /></Link>)}</section>
      <div className="jesus-side-callout"><BookOpenText size={20} /><h3>Veja o contexto completo</h3><p>Conecte estes momentos aos personagens e acontecimentos do século I.</p><Link to="/linha-do-tempo?period=jesus" className="text-link">Explorar período <ArrowRight size={14} /></Link></div>
    </aside></div>
  </article>
}
