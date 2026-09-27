import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ChevronDown, Filter, Focus, Minus, Plus, RotateCcw, X } from 'lucide-react'
import { DateBadge } from '../components/Shared'
import { empires, events, getPeriod, periods, persons, books } from '../repositories/catalogRepository'
import { formatYear, timelinePercent, yearsOverlap } from '../utils/dates'
import { filterByDateWindow, filterByPeriod } from '../utils/timelineFilters'
import type { EventRecord } from '../types'
import { EditorialImage } from '../components/EditorialImage'
import { imageForPeriod } from '../media/manifest'

type Layer = 'events' | 'persons' | 'empires' | 'books'
interface Point<T> { item: T; left: number; row: number; width?: number }
const MIN_YEAR = -2100
const MAX_YEAR = 100
const TRACK_BASE_WIDTH = 2350
const LAYER_NAMES: Record<Layer, string> = { events: 'Acontecimentos', persons: 'Personagens (contexto)', empires: 'Impérios', books: 'Livros bíblicos' }

export default function TimelinePage() {
  const [params, setParams] = useSearchParams()
  const selectedPeriod = params.get('period') || ''
  const selectedEmpire = empires.find((empire) => empire.id === params.get('imp'))
  const [mobileView, setMobileView] = useState<'list' | 'panorama'>('list')
  const [visibleLayers, setVisibleLayers] = useState<Layer[]>(['events'])
  const [filterOpen, setFilterOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null)
  const activePeriod = getPeriod(selectedPeriod)
  const minYear = activePeriod ? activePeriod.startYear : MIN_YEAR
  const maxYear = activePeriod ? activePeriod.endYear : MAX_YEAR
  const trackWidth = TRACK_BASE_WIDTH * zoom
  const periodEvents = useMemo(() => filterByPeriod(events, activePeriod?.id), [activePeriod])
  const activeEvents = useMemo(() => visibleLayers.includes('events') ? filterByDateWindow(periodEvents, minYear, maxYear) : [], [periodEvents, visibleLayers, minYear, maxYear])
  const activePersons = useMemo(() => visibleLayers.includes('persons') ? filterByDateWindow(persons, minYear, maxYear) : [], [visibleLayers, minYear, maxYear])
  const activeEmpires = useMemo(() => visibleLayers.includes('empires') ? filterByDateWindow(empires, minYear, maxYear) : [], [visibleLayers, minYear, maxYear])
  const activeBooks = useMemo(() => visibleLayers.includes('books') ? filterByDateWindow(books.map((book) => ({ ...book, startYear: book.narrativeStartYear, endYear: book.narrativeEndYear })), minYear, maxYear) : [], [visibleLayers, minYear, maxYear])

  const toggleLayer = (layer: Layer) => setVisibleLayers((current) => current.includes(layer) ? current.filter((item) => item !== layer) : [...current, layer])
  const selectPeriod = (id: string) => { setSelectedEvent(null); setParams(id ? { period: id } : {}) }

  return <div className="timeline-page">
    <div className="page-intro-row"><div><div className="breadcrumbs"><Link to="/">Início</Link><span>›</span><span>Cronologia</span></div><span className="eyebrow">ATLAS HISTÓRICO</span><h1>Linha do tempo</h1><p>Comece pelos acontecimentos. Ative outras camadas nos filtros quando quiser aprofundar.</p></div><div className="timeline-actions"><button className={`button button-outline ${filterOpen ? 'active' : ''}`} onClick={() => setFilterOpen(!filterOpen)}><Filter size={16} /> Filtros <span className="filter-count">{visibleLayers.length}</span></button><button className="icon-button border-button" onClick={() => { setZoom(1); setParams({}) }} aria-label="Centralizar linha do tempo" title="Centralizar"><Focus size={17} /></button></div></div>

    {filterOpen && <section className="timeline-filter-panel"><div className="filter-panel-title"><div><strong>Camadas e filtros</strong><small>Escolha o que aparece na cronologia.</small></div><button className="icon-button" onClick={() => setFilterOpen(false)} aria-label="Fechar filtros"><X size={18} /></button></div><div className="layer-options">{(Object.keys(LAYER_NAMES) as Layer[]).map((layer) => <label key={layer} className="layer-checkbox"><input type="checkbox" checked={visibleLayers.includes(layer)} onChange={() => toggleLayer(layer)} /><span className={`layer-dot layer-${layer}`} />{LAYER_NAMES[layer]}</label>)}</div><div className="filter-period-row"><label htmlFor="period-select">Período selecionado</label><div className="select-wrap"><select id="period-select" value={selectedPeriod} onChange={(event) => setParams(event.target.value ? { period: event.target.value } : {})}><option value="">Visão geral</option>{periods.map((period) => <option key={period.id} value={period.id}>{period.title}</option>)}</select><ChevronDown size={15} /></div><button className="text-button" onClick={() => { setVisibleLayers(['events']); setParams({}) }}><RotateCcw size={14} /> Limpar</button></div></section>}

    <div className="period-quick-nav"><span className="quick-nav-label">PULAR PARA</span>{periods.map((period) => <button key={period.id} onClick={() => selectPeriod(period.id)} className={selectedPeriod === period.id ? 'selected' : ''}>{period.shortTitle}</button>)}{activePeriod && <button className="clear-period" onClick={() => selectPeriod('')}><X size={13} /> Visão geral</button>}</div>

    {selectedEmpire && <div className="empire-focus"><span className="tiny-color-dot" style={{ backgroundColor: selectedEmpire.color }} /><strong>{selectedEmpire.title}</strong><span>{selectedEmpire.dateLabel}</span><button onClick={() => setParams(selectedPeriod ? { period: selectedPeriod } : {})} aria-label="Remover destaque do império"><X size={16} /></button></div>}
    <div className="timeline-view-switch" aria-label="Visualização no celular"><button className={mobileView === 'list' ? 'active' : ''} aria-pressed={mobileView === 'list'} onClick={() => setMobileView('list')}>Lista por período</button><button className={mobileView === 'panorama' ? 'active' : ''} aria-pressed={mobileView === 'panorama'} onClick={() => setMobileView('panorama')}>Panorama horizontal</button></div>

    <div className={`timeline-mobile-list ${mobileView === 'panorama' ? 'mobile-hidden' : ''}`}>{periods.filter((period) => !activePeriod || period.id === activePeriod.id).map((period) => {
      const items = events.filter((event) => event.periodId === period.id && visibleLayers.includes('events'))
      const people = persons.filter((person) => period.id !== 'origins' && visibleLayers.includes('persons') && yearsOverlap(person.startYear, person.endYear ?? person.startYear, period.startYear, period.endYear))
      const kingdoms = empires.filter((empire) => period.id !== 'origins' && visibleLayers.includes('empires') && yearsOverlap(empire.startYear, empire.endYear, period.startYear, period.endYear))
      const texts = books.filter((book) => visibleLayers.includes('books') && yearsOverlap(book.narrativeStartYear, book.narrativeEndYear, period.startYear, period.endYear))
      return <section className="mobile-period" key={period.id} style={{ '--era-color': period.color } as React.CSSProperties}>{imageForPeriod[period.id] && <div className="mobile-period-image"><EditorialImage image={imageForPeriod[period.id]!} /><span>Ilustração interpretativa</span></div>}<div className="mobile-period-heading"><div><span className="eyebrow">{period.dateLabel}</span><h2>{period.title}</h2><p>{period.description}</p></div><button onClick={() => { setParams({ period: period.id }); setMobileView('panorama') }}>Ver faixa</button></div>{items.map((event) => <Link key={event.id} className="mobile-timeline-item" to={`/evento/${event.slug}`}><span className="mobile-timeline-point"/><span><strong>{event.title}</strong><small>{event.dateLabel} · {event.dateType === 'disputed' ? 'data debatida' : event.dateType === 'approximate' ? 'aproximada' : 'evento'}</small></span></Link>)}{people.length > 0 && <div className="mobile-related"><strong>Personagens</strong><div>{people.map((person) => <Link key={person.id} to={`/personagem/${person.slug}`}>{person.title}</Link>)}</div></div>}{kingdoms.length > 0 && <div className="mobile-related"><strong>Impérios</strong><div>{kingdoms.map((empire) => <span key={empire.id} className={selectedEmpire?.id === empire.id ? 'empire-selected' : ''}>{empire.title} · {empire.dateLabel}</span>)}</div></div>}{texts.length > 0 && <div className="mobile-related"><strong>Livros (período narrado)</strong><div>{texts.map((book) => <Link key={book.id} to={`/livro/${book.slug}`}>{book.title}</Link>)}</div></div>}{period.id === 'origins' && <p className="muted">Relatos de origens sem posição numérica. <Link to="/livro/genesis">Consultar Gênesis →</Link></p>}{period.id !== 'origins' && !items.length && !people.length && !kingdoms.length && !texts.length && <p className="muted">Sem registros nas camadas selecionadas.</p>}</section>
    })}</div>

    <section className={`timeline-card ${mobileView === 'list' ? 'mobile-hidden' : ''}`}>
      <div className="timeline-card-heading"><div><span className="eyebrow">{activePeriod ? 'PERÍODO SELECIONADO' : 'VISÃO GERAL'}</span><h2>{activePeriod?.title ?? 'Dos patriarcas à igreja primitiva'}</h2><p>{activePeriod?.description ?? 'Arraste para percorrer o tempo. Selecione um item para abrir seu contexto.'}</p></div><div className="zoom-controls"><button aria-label="Afastar" onClick={() => setZoom((value) => Math.max(0.8, Number((value - 0.2).toFixed(1))))}><Minus size={15} /></button><span>{Math.round(zoom * 100)}%</span><button aria-label="Aproximar" onClick={() => setZoom((value) => Math.min(1.8, Number((value + 0.2).toFixed(1))))}><Plus size={15} /></button></div></div>
      {!activePeriod && <div className="origins-callout"><span><strong>Origens e mundo primitivo</strong><small>Relatos anteriores à escala histórica datada.</small></span><button onClick={() => selectPeriod('origins')}>Explorar origens →</button></div>}
      {activePeriod?.id === 'origins' ? <div className="origins-context"><h3>Antes da escala datada</h3><p>Os relatos de Gênesis sobre criação, primeiras gerações e dilúvio não recebem aqui uma posição numérica. Consulte o contexto e as referências sem tratar uma data proposta como fato estabelecido.</p><Link to="/livro/genesis" className="button button-dark">Explorar Gênesis</Link></div> : <div className="timeline-overflow">
        <div className="timeline-canvas" style={{ width: `${trackWidth}px` }}>
          <div className="timeline-period-ribbon"><span className="lane-label">PERÍODOS</span><div className="ribbon-track">{periods.filter((period) => period.id !== 'origins' && yearsOverlap(period.startYear, period.endYear, minYear, maxYear)).map((period) => <button key={period.id} className={`period-ribbon-segment ${selectedPeriod === period.id ? 'active' : ''}`} style={{ left: `${timelinePercent(Math.max(period.startYear, minYear), minYear, maxYear)}%`, width: `${Math.max(1.7, timelinePercent(Math.min(period.endYear, maxYear), minYear, maxYear) - timelinePercent(Math.max(period.startYear, minYear), minYear, maxYear))}%`, '--era-color': period.color } as React.CSSProperties} title={`${period.title} · ${period.dateLabel}`} onClick={() => selectPeriod(period.id)}>{period.shortTitle}</button>)}</div></div>
          <div className="timeline-year-ruler"><span className="lane-label">ANO</span><div className="ruler-track">{axisYears(minYear, maxYear).map((year, index) => <span key={`${year}-${index}`} className="ruler-tick" style={{ left: `${timelinePercent(year, minYear, maxYear)}%` }}><i />{year === 0 ? '1 a.C. / 1 d.C.' : formatYear(year)}</span>)}</div></div>
          {visibleLayers.includes('events') && <TrackSection name={LAYER_NAMES.events} className="layer-events" points={layoutPoints(activeEvents, minYear, maxYear, trackWidth, 170)} render={(event) => <button className={`timeline-event-pill ${selectedEvent?.id === event.id ? 'selected' : ''}`} onClick={() => setSelectedEvent(event)} title={`${event.title} · ${event.dateLabel}`}><span className="event-point" /><span><strong>{event.title}</strong><small>{event.dateLabel}</small></span></button>} />}
          {visibleLayers.includes('persons') && <TrackSection name={LAYER_NAMES.persons} className="layer-persons" points={layoutSpans(activePersons, minYear, maxYear, trackWidth)} render={(person) => <Link to={`/personagem/${person.slug}`} className="timeline-span person-span" title={`${person.title} · ${person.dateLabel}`}><span className="span-dot" /><strong>{person.title}</strong><small>{person.dateLabel}</small></Link>} />}
          {visibleLayers.includes('empires') && <TrackSection name={LAYER_NAMES.empires} className="layer-empires" points={layoutSpans(activeEmpires, minYear, maxYear, trackWidth)} render={(empire) => <span className={`timeline-span empire-span ${selectedEmpire?.id === empire.id ? 'empire-selected' : ''}`} style={{ '--span-color': empire.color } as React.CSSProperties} title={empire.dateLabel}><strong>{empire.title}</strong><small>{empire.dateLabel}</small></span>} />}
          {visibleLayers.includes('books') && <TrackSection name={LAYER_NAMES.books} className="layer-books" points={layoutBooks(activeBooks, minYear, maxYear, trackWidth)} render={(book) => <Link to={`/livro/${book.slug}`} className={`timeline-span book-span ${book.testament === 'NT' ? 'new-testament' : ''}`} title={`${book.title} · período narrado`}><strong>{book.title}</strong><small>período narrado</small></Link>} />}
          <div className="timeline-bottom-ruler"><span>← Mais antigo</span><span>Tempo →</span><span>Mais recente →</span></div>
        </div>
      </div>
      }
      <div className="timeline-legend"><span><i className="legend-event" />Acontecimentos</span><span><i className="legend-person" />Personagens</span><span><i className="legend-empire" />Impérios</span><span><i className="legend-book" />Livros (período narrado)</span><span className="legend-note">Livros nesta faixa mostram o contexto narrado, não a data em que foram escritos. <Link to="/livros">Ver composição dos livros →</Link></span></div>
    </section>

    {selectedEvent && <aside className="quick-card"><div className="quick-card-top"><span className="eyebrow">ACONTECIMENTO</span><button className="icon-button" aria-label="Fechar detalhes" onClick={() => setSelectedEvent(null)}><X size={17} /></button></div><h3>{selectedEvent.title}</h3><DateBadge label={selectedEvent.dateLabel} type={selectedEvent.dateType} /><p>{selectedEvent.shortDescription}</p><div className="quick-references"><span className="eyebrow">REFERÊNCIAS</span><div>{selectedEvent.references.slice(0, 3).map((ref) => <span key={ref.label}>{ref.label}</span>)}</div></div><Link to={`/evento/${selectedEvent.slug}`} className="button button-dark button-full">Ver detalhes <ChevronDown size={15} className="rotated" /></Link></aside>}
    <div className="timeline-caveat"><span className="info-mark">i</span><span>Datas representadas como anos históricos assinados (ex.: −586 = 586 a.C.). Algumas posições são aproximadas ou debatidas; consulte os detalhes e as referências.</span></div>
  </div>
}

function TrackSection<T extends { startYear: number; title: string } & object>({ name, className, points, render }: { name: string; className: string; points: Point<T>[]; render: (item: T) => React.ReactNode }) {
  const height = Math.max(58, (Math.max(-1, ...points.map((point) => point.row)) + 1) * 52)
  return <div className={`timeline-lane ${className}`} style={{ minHeight: `${height}px` }}><span className="lane-label">{name.toUpperCase()}</span><div className="lane-track" style={{ width: '100%', minHeight: `${height}px` }}>{points.length ? points.map(({ item, left, row, width }) => <div key={item.title} className="timeline-position" style={{ left: `${left}%`, top: `${row * 52 + 6}px`, width: width ? `${width}%` : undefined }}>{render(item)}</div>) : <span className="lane-empty">Sem registros nesta camada para o período selecionado.</span>}</div></div>
}

function layoutPoints<T extends { startYear: number; title: string }>(items: T[], min: number, max: number, width: number, boxWidth: number): Point<T>[] {
  const rowsEnd: number[] = []
  return [...items].sort((a, b) => a.startYear - b.startYear).map((item) => {
    const x = timelinePercent(item.startYear, min, max) * width / 100
    let row = rowsEnd.findIndex((end) => x > end + 10)
    if (row < 0) row = rowsEnd.length
    rowsEnd[row] = x + boxWidth
    return { item, left: timelinePercent(item.startYear, min, max), row }
  })
}

function layoutSpans<T extends { startYear: number; endYear?: number; title: string }>(items: T[], min: number, max: number, width: number): Point<T>[] {
  const rowsEnd: number[] = []
  return [...items].sort((a, b) => a.startYear - b.startYear).map((item) => {
    const left = timelinePercent(Math.max(item.startYear, min), min, max)
    const right = timelinePercent(Math.min(item.endYear ?? item.startYear, max), min, max)
    const x = left * width / 100
    const spanWidth = Math.max(65, (right - left) * width / 100)
    let row = rowsEnd.findIndex((end) => x > end + 8)
    if (row < 0) row = rowsEnd.length
    rowsEnd[row] = x + spanWidth
    return { item, left, row, width: spanWidth / width * 100 }
  })
}

type BookSpan = (typeof books)[number] & { startYear: number; endYear: number }
function layoutBooks(items: typeof books, min: number, max: number, width: number): Point<BookSpan>[] {
  const bookPoints: BookSpan[] = items.map((book) => ({ ...book, startYear: book.narrativeStartYear, endYear: book.narrativeEndYear }))
  return layoutSpans(bookPoints, min, max, width)
}

function axisYears(min: number, max: number): number[] {
  return Array.from({ length: 5 }, (_, index) => Math.round(min + ((max - min) * index) / 4))
}
