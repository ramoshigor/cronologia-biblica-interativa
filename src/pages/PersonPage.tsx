import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowRight, BookOpenText, Clock3, MapPin, UsersRound } from 'lucide-react'
import { Breadcrumbs, DateBadge, FavoriteButton, NotePanel, ReferencePills, SectionHeading } from '../components/Shared'
import { events, persons, books, places, getPerson } from '../repositories/catalogRepository'
import { historyService } from '../services/historyService'
import { formatYear, yearsOverlap } from '../utils/dates'
import NotFoundPage from './NotFoundPage'

export default function PersonPage() {
  const { slug = '' } = useParams()
  const person = getPerson(slug)
  useEffect(() => { if (person) historyService.record({ type: 'person', id: person.id, slug: person.slug, title: person.title, href: `/personagem/${person.slug}` }) }, [person])
  if (!person) return <NotFoundPage />
  const lifeEvents = person.eventIds.map((id) => events.find((event) => event.id === id)).filter((event) => event !== undefined).sort((a, b) => a.startYear - b.startYear)
  const personBooks = person.bookIds.map((id) => books.find((book) => book.id === id)).filter((book) => book !== undefined)
  const personPlaces = person.placeIds.map((id) => places.find((place) => place.id === id)).filter((place) => place !== undefined)
  const family = (person.family ?? []).map((id) => persons.find((item) => item.id === id)).filter((item) => item !== undefined)
  const contemporaries = persons.filter((item) => item.id !== person.id && yearsOverlap(person.birthYear, person.deathYear ?? person.startYear, item.birthYear, item.deathYear ?? item.startYear)).slice(0, 5)
  const min = Math.min(...persons.map((item) => item.birthYear))
  const max = Math.max(...persons.map((item) => item.deathYear ?? item.startYear))
  const left = ((person.birthYear - min) / (max - min)) * 100
  const width = Math.max(1.2, (((person.deathYear ?? person.startYear) - person.birthYear) / (max - min)) * 100)
  const axisLabels = Array.from({ length: 4 }, (_, index) => formatYear(Math.round(min + ((max - min) * index) / 3)))

  return <article className="detail-page person-page">
    <Breadcrumbs items={[{ label: 'Início', href: '/' }, { label: 'Explorar', href: '/explorar?tab=personagens' }, { label: person.title }]} />
    <header className="person-hero detail-hero"><div className="person-portrait"><span>{person.title === 'Jesus Cristo' ? '✧' : person.title.charAt(0)}</span><i className="portrait-ring ring-a"/><i className="portrait-ring ring-b"/><small>{person.role}</small></div><div className="detail-hero-copy"><div className="detail-kicker"><span className="eyebrow">PERSONAGEM BÍBLICO</span><span className="detail-category">{person.role}</span></div><h1>{person.title}</h1><p className="detail-summary">{person.shortDescription}</p><DateBadge label={person.dateLabel} type={person.dateType} /><div className="detail-actions"><Link to={`/linha-do-tempo?period=${person.eventIds[0] ? events.find((event) => event.id === person.eventIds[0])?.periodId ?? '' : ''}`} className="button button-dark"><Clock3 size={16} /> Ver na cronologia</Link><FavoriteButton type="person" id={person.id} label="Salvar" /></div></div></header>

    <div className="detail-layout"><div className="detail-main-column">
      <section className="content-card"><SectionHeading eyebrow="BIOGRAFIA" title="Sobre" /><p className="body-copy">{person.description}</p><div className="life-bar-wrap"><div className="life-bar-labels"><span>{formatYear(person.birthYear)}</span><span>Vida aproximada</span><span>{person.deathYear ? formatYear(person.deathYear) : '—'}</span></div><div className="life-axis"><div className="life-range" style={{ left: `${left}%`, width: `${width}%` }}><span className="life-start-dot" /><span className="life-end-dot" /></div></div><div className="life-axis-legend">{axisLabels.map((label, index) => <span key={index}>{label}</span>)}</div></div></section>
      <section className="content-card"><SectionHeading eyebrow="LINHA DA VIDA" title="Momentos principais" description="Acontecimentos associados a esta pessoa." />{lifeEvents.length ? <div className="life-events-list">{lifeEvents.map((event, index) => <Link key={event.id} to={`/evento/${event.slug}`} className="life-event-row"><span className="life-event-marker">{index + 1}</span><span><strong>{event.title}</strong><small>{event.shortDescription}</small></span><span className="life-event-date">{event.dateLabel}</span><ArrowRight size={15} /></Link>)}</div> : <p className="muted">Ainda não há acontecimentos associados.</p>}</section>
      <section className="content-card"><SectionHeading eyebrow="TEXTOS RELACIONADOS" title="Referências bíblicas" /><ReferencePills references={person.references} /></section>
      {family.length > 0 && <section className="content-card"><SectionHeading eyebrow="FAMÍLIA E RELAÇÕES" title="Pessoas relacionadas" /><div className="detail-entity-grid">{family.map((member) => <Link key={member.id} to={`/personagem/${member.slug}`} className="person-mini-card"><span className="person-avatar family-avatar">{member.title.charAt(0)}</span><span><strong>{member.title}</strong><small>{member.role}</small></span><ArrowRight size={15} /></Link>)}</div></section>}
      {contemporaries.length > 0 && <section className="content-card"><SectionHeading eyebrow="MESMA ÉPOCA" title="Contemporâneos" description="Pessoas cuja vida se sobrepõe, conforme as faixas cronológicas desta amostra." /><div className="contemporary-grid">{contemporaries.map((item) => <Link key={item.id} to={`/personagem/${item.slug}`} className="contemporary-card"><span className="contemporary-dot"/><strong>{item.title}</strong><small>{item.dateLabel}</small></Link>)}</div></section>}
    </div><aside className="detail-side-column"><div className="side-info-card"><span className="eyebrow">PERFIL</span><h3>{person.title}</h3><p>{person.role}</p><DateBadge label={person.dateLabel} type={person.dateType} /><div className="side-divider"/><div className="side-meta-row"><span>Função</span><strong>{person.role}</strong></div><div className="side-meta-row"><span>Eventos</span><strong>{lifeEvents.length}</strong></div><div className="side-meta-row"><span>Livros</span><strong>{personBooks.length}</strong></div></div>
      {personPlaces.length > 0 && <div className="source-card"><span className="eyebrow">LUGARES RELACIONADOS</span>{personPlaces.map((place) => <Link key={place.id} to={`/lugar/${place.slug}`} className="source-row"><MapPin size={15} /><span><strong>{place.title}</strong><small>{place.shortDescription}</small></span></Link>)}</div>}
      {personBooks.length > 0 && <div className="source-card"><span className="eyebrow">LIVROS RELACIONADOS</span>{personBooks.map((book) => <Link key={book.id} to={`/livro/${book.slug}`} className="source-row"><BookOpenText size={15} /><span><strong>{book.title}</strong><small>{book.category} · {book.testament === 'AT' ? 'AT' : 'NT'}</small></span></Link>)}</div>}
      <NotePanel type="person" entityId={person.id} /><div className="side-study-note"><UsersRound size={17} /><p>As faixas de vida são aproximadas. A comparação visual mostra sobreposições propostas, não datas biográficas exatas.</p></div></aside></div>
  </article>
}
