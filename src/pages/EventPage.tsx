import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, ArrowRight, BookOpenText, MapPin, UsersRound } from 'lucide-react'
import { Breadcrumbs, DateBadge, FavoriteButton, NotePanel, ReferencePills, SectionHeading } from '../components/Shared'
import { empires, events, getEvent, getPeriod, places, persons, sources } from '../repositories/catalogRepository'
import { historyService } from '../services/historyService'
import { compareChronologically } from '../utils/dates'
import NotFoundPage from './NotFoundPage'
import { EditorialImage } from '../components/EditorialImage'
import { imageForEvent } from '../media/manifest'

export default function EventPage() {
  const { slug = '' } = useParams()
  const event = getEvent(slug)
  useEffect(() => { if (event) historyService.record({ type: 'event', id: event.id, slug: event.slug, title: event.title, href: `/evento/${event.slug}` }) }, [event])
  if (!event) return <NotFoundPage />

  const period = getPeriod(event.periodId)
  const artwork = imageForEvent[event.id]
  const relatedPeople = event.personIds.map((id) => persons.find((person) => person.id === id)).filter((person) => person !== undefined)
  const relatedPlaces = event.placeIds.map((id) => places.find((place) => place.id === id)).filter((place) => place !== undefined)
  const relatedEmpires = event.empireIds.map((id) => empires.find((empire) => empire.id === id)).filter((empire) => empire !== undefined)
  const related = event.relatedEventIds.map((id) => events.find((item) => item.id === id)).filter((item) => item !== undefined)
  const previous = events.filter((item) => item.id !== event.id && item.startYear < event.startYear).sort(compareChronologically).slice(-3).reverse()
  const next = events.filter((item) => item.id !== event.id && item.startYear > event.startYear).sort(compareChronologically).slice(0, 3)
  const eventSources = sources.filter((source) => event.sourceIds.includes(source.id))

  return <article className="detail-page">
    <Breadcrumbs items={[{ label: 'Início', href: '/' }, { label: 'Cronologia', href: '/linha-do-tempo' }, { label: event.title }]} />
    <header className="detail-hero event-detail-hero"><div className="detail-hero-art">{artwork && <EditorialImage image={artwork} className="detail-editorial" />}<span className="detail-art-ring"/><span className="detail-art-sun"/><span className="detail-art-temple">⌂</span><span className="detail-art-caption">{artwork ? 'ILUSTRAÇÃO INTERPRETATIVA' : period?.shortTitle ?? 'HISTÓRIA BÍBLICA'}</span></div><div className="detail-hero-copy"><div className="detail-kicker"><span className="eyebrow">{period?.title ?? 'ACONTECIMENTO'}</span><span className="detail-category">{event.category === 'kingdom' ? 'Reino' : event.category === 'journey' ? 'Viagem' : event.category === 'covenant' ? 'Aliança' : event.category === 'ministry' ? 'Ministério' : 'Evento'}</span></div><h1>{event.title}</h1><p className="detail-summary">{event.shortDescription}</p><DateBadge label={event.dateLabel} type={event.dateType} /><div className="detail-actions"><Link to={`/linha-do-tempo?period=${event.periodId}`} className="button button-dark"><ArrowLeft size={16} /> Ver na cronologia</Link><FavoriteButton type="event" id={event.id} label="Salvar" /></div></div></header>

    <div className="detail-layout"><div className="detail-main-column">
      <section className="content-card"><SectionHeading eyebrow="CONTEXTO HISTÓRICO" title="O que aconteceu" /><p className="body-copy">{event.description}</p><div className="event-period-callout"><span className="period-callout-mark" style={{ backgroundColor: period?.color }} /> <div><small>PERÍODO HISTÓRICO</small><strong>{period?.title ?? '—'}</strong><span>{period?.dateLabel}</span></div><Link to={`/linha-do-tempo?period=${event.periodId}`}>Explorar período <ArrowRight size={14} /></Link></div></section>
      <section className="content-card"><SectionHeading eyebrow="TEXTO BÍBLICO" title="Referências" description="Passagens relacionadas a este acontecimento." /><ReferencePills references={event.references} /></section>
      {relatedPeople.length > 0 && <section className="content-card"><SectionHeading eyebrow="PESSOAS" title="Personagens relacionados" /><div className="detail-entity-grid">{relatedPeople.map((person) => <Link key={person.id} to={`/personagem/${person.slug}`} className="person-mini-card"><span className="person-avatar">{person.title.charAt(0)}</span><span><strong>{person.title}</strong><small>{person.role} · {person.dateLabel}</small></span><ArrowRight size={15} /></Link>)}</div></section>}
      {relatedPlaces.length > 0 && <section className="content-card"><SectionHeading eyebrow="GEOGRAFIA" title="Lugares" /><div className="pill-link-row">{relatedPlaces.map((place) => <Link key={place.id} to={`/lugar/${place.slug}`} className="place-pill"><MapPin size={14} />{place.title}<ArrowRight size={13} /></Link>)}</div></section>}
      {relatedEmpires.length > 0 && <section className="content-card"><SectionHeading eyebrow="CENÁRIO POLÍTICO" title="Impérios relacionados" /><div className="pill-link-row">{relatedEmpires.map((empire) => <span key={empire.id} className="place-pill empire-pill"><span className="tiny-color-dot" style={{ backgroundColor: empire.color }} />{empire.title}<small>{empire.dateLabel}</small></span>)}</div></section>}
      {related.length > 0 && <section className="content-card"><SectionHeading eyebrow="CONEXÕES" title="Acontecimentos relacionados" /><div className="related-event-list">{related.map((item) => <Link key={item.id} to={`/evento/${item.slug}`} className="related-event-item"><span className="related-year">{item.dateLabel}</span><span><strong>{item.title}</strong><small>{item.shortDescription}</small></span><ArrowRight size={16} /></Link>)}</div></section>}
      <section className="content-card nearby-events"><SectionHeading eyebrow="CONTEXTO CRONOLÓGICO" title="Antes e depois" /><div className="nearby-columns"><div><h3>Antes</h3>{previous.map((item) => <Link key={item.id} to={`/evento/${item.slug}`} className="nearby-event"><small>{item.dateLabel}</small><strong>{item.title}</strong></Link>)}</div><div><h3>Depois</h3>{next.map((item) => <Link key={item.id} to={`/evento/${item.slug}`} className="nearby-event"><small>{item.dateLabel}</small><strong>{item.title}</strong></Link>)}</div></div></section>
    </div><aside className="detail-side-column"><div className="side-info-card"><span className="eyebrow">EM UMA LINHA</span><h3>{event.title}</h3><p>{event.shortDescription}</p><DateBadge label={event.dateLabel} type={event.dateType} /><div className="side-divider"/><div className="side-meta-row"><span>Período</span><Link to={`/linha-do-tempo?period=${event.periodId}`}>{period?.shortTitle}</Link></div><div className="side-meta-row"><span>Categoria</span><strong>{event.category === 'kingdom' ? 'Reino' : event.category === 'journey' ? 'Viagem' : event.category === 'covenant' ? 'Aliança' : event.category === 'ministry' ? 'Ministério' : 'Evento'}</strong></div><div className="side-meta-row"><span>Data</span><strong>{event.dateType === 'disputed' ? 'Debatida' : event.dateType === 'approximate' ? 'Aproximada' : '—'}</strong></div></div><NotePanel type="event" entityId={event.id} /><div className="source-card"><span className="eyebrow">FONTES E LEITURAS</span><p>As referências abaixo orientam o contexto deste registro.</p>{eventSources.map((source) => <div key={source.id} className="source-row"><BookOpenText size={15} /><span><strong>{source.title}</strong><small>{source.author ?? source.publisher ?? source.note}</small></span></div>)}</div><div className="side-study-note"><UsersRound size={17} /><p>As relações entre pessoas e eventos organizam a navegação. As datas históricas são apresentadas como aproximações quando não há consenso.</p></div></aside></div>
  </article>
}
