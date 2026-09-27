import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { BookOpenText, CalendarDays, MapPin, Search, UserRound } from 'lucide-react'
import { Breadcrumbs, DateBadge, SectionHeading } from '../components/Shared'
import { books, events, persons, places } from '../repositories/catalogRepository'
import { searchCatalog } from '../services/searchService'

type Tab = 'eventos' | 'personagens' | 'livros' | 'lugares'
const tabs: Array<{ id: Tab; label: string }> = [{ id: 'eventos', label: 'Acontecimentos' }, { id: 'personagens', label: 'Personagens' }, { id: 'livros', label: 'Livros bíblicos' }, { id: 'lugares', label: 'Lugares' }]
const normal = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR')

export default function ExplorePage() {
  const [params, setParams] = useSearchParams()
  const initial = params.get('tab')
  const tab: Tab = initial === 'personagens' || initial === 'livros' || initial === 'lugares' ? initial : 'eventos'
  const [query, setQuery] = useState('')
  const setActiveTab = (value: Tab) => setParams(value === 'eventos' ? {} : { tab: value })
  const q = normal(query)
  const matches = useMemo(() => q.length >= 2 ? new Set(searchCatalog(query, 200).map((item) => item.id)) : null, [q, query])
  const filteredEvents = useMemo(() => events.filter((item) => matches ? matches.has(item.id) || normal(`${item.title} ${item.shortDescription} ${item.dateLabel}`).includes(q) : normal(`${item.title} ${item.shortDescription} ${item.dateLabel}`).includes(q)), [q, matches])
  const filteredPeople = useMemo(() => persons.filter((item) => matches ? matches.has(item.id) || normal(`${item.title} ${item.role} ${item.shortDescription}`).includes(q) : normal(`${item.title} ${item.role} ${item.shortDescription}`).includes(q)), [q, matches])
  const filteredBooks = useMemo(() => books.filter((item) => matches ? matches.has(item.id) || normal(`${item.title} ${item.category} ${item.description}`).includes(q) : normal(`${item.title} ${item.category} ${item.description}`).includes(q)), [q, matches])
  const filteredPlaces = useMemo(() => places.filter((item) => matches ? matches.has(item.id) || normal(`${item.title} ${item.shortDescription}`).includes(q) : normal(`${item.title} ${item.shortDescription}`).includes(q)), [q, matches])
  return <div className="explore-page"><Breadcrumbs items={[{ label: 'Início', href: '/' }, { label: 'Explorar' }]} /><div className="page-title-row"><div><span className="eyebrow">ENCICLOPÉDIA CONECTADA</span><h1>Explore a história bíblica</h1><p>Pesquise e navegue por pessoas, acontecimentos, livros e lugares.</p></div><span className="explore-title-icon"><BookOpenText size={22} /></span></div>
    <div className="explore-search"><Search size={18} aria-hidden="true" /><input type="search" aria-label="Filtrar conteúdo" placeholder="Filtrar por nome ou descrição..." value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button type="button" aria-label="Limpar filtro" onClick={() => setQuery('')}>Limpar</button>}</div>
    <div className="explore-tabs" role="group" aria-label="Categoria de conteúdo">{tabs.map((item) => <button key={item.id} type="button" aria-pressed={tab === item.id} className={tab === item.id ? 'active' : ''} onClick={() => setActiveTab(item.id)}>{item.label}<span>{item.id === 'eventos' ? events.length : item.id === 'personagens' ? persons.length : item.id === 'livros' ? books.length : places.length}</span></button>)}</div>
    <div className="explore-results">{tab === 'eventos' && <><SectionHeading title="Acontecimentos" description={`${filteredEvents.length} registros na amostra.`} /><div className="explore-card-grid">{filteredEvents.map((event) => <Link key={event.id} to={`/evento/${event.slug}`} className="explore-item-card"><div className="explore-item-top"><span className="event-type-icon"><CalendarDays size={17} /></span><DateBadge label={event.dateLabel} type={event.dateType} /></div><h3>{event.title}</h3><p>{event.shortDescription}</p><div className="explore-card-bottom"><span>{event.references[0]?.label ?? 'Sem referência'}</span><span>Ver detalhes →</span></div></Link>)}</div></>}
      {tab === 'personagens' && <><SectionHeading title="Personagens" description={`${filteredPeople.length} vidas para explorar.`} /><div className="explore-card-grid">{filteredPeople.map((person) => <Link key={person.id} to={`/personagem/${person.slug}`} className="explore-item-card person-explore-card"><div className="explore-person-head"><span className="person-avatar">{person.title.charAt(0)}</span><span className="role-tag">{person.role}</span></div><h3>{person.title}</h3><p>{person.shortDescription}</p><div className="explore-card-bottom"><span>{person.dateLabel}</span><span>Perfil →</span></div></Link>)}</div></>}
      {tab === 'livros' && <><SectionHeading title="Livros bíblicos" description="Período narrado e proposta de composição são conceitos diferentes." /><div className="explore-card-grid">{filteredBooks.map((book) => <Link key={book.id} to={`/livro/${book.slug}`} className="explore-item-card"><div className="explore-item-top"><span className="book-testament">{book.testament}</span><span className="role-tag">{book.category}</span></div><h3>{book.title}</h3><p>{book.description}</p><div className="explore-card-bottom"><span>{book.testament === 'AT' ? 'Antigo Testamento' : 'Novo Testamento'}</span><span>Explorar →</span></div></Link>)}</div></>}
      {tab === 'lugares' && <><SectionHeading title="Lugares" description={`${filteredPlaces.length} lugares mencionados nos registros desta amostra.`} /><div className="explore-card-grid">{filteredPlaces.map((place) => <Link key={place.id} to={`/lugar/${place.slug}`} className="explore-item-card"><div className="explore-item-top"><span className="event-type-icon place-type"><MapPin size={17} /></span><span className="role-tag">Lugar bíblico</span></div><h3>{place.title}</h3><p>{place.shortDescription}</p><div className="explore-card-bottom"><span>{place.references[0]?.label ?? 'Referência em estudo'}</span><span>Ver lugar →</span></div></Link>)}</div></>}
      {((tab === 'eventos' && !filteredEvents.length) || (tab === 'personagens' && !filteredPeople.length) || (tab === 'livros' && !filteredBooks.length) || (tab === 'lugares' && !filteredPlaces.length)) && <div className="empty-state"><span><UserRound size={20} /></span><h3>Nenhum resultado</h3><p>Tente uma palavra mais curta ou mude de categoria.</p></div>}
    </div></div>
}
