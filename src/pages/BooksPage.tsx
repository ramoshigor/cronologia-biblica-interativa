import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { BookOpenText, CalendarRange, Search } from 'lucide-react'
import { Breadcrumbs } from '../components/Shared'
import { EditorialImage } from '../components/EditorialImage'
import { editorialImages } from '../media/manifest'
import { books } from '../repositories/catalogRepository'
import { formatYear } from '../utils/dates'
import type { BookRecord } from '../types'
import './BooksPage.css'

type View = 'canon' | 'composition'
const canonGroups = [
  ['Pentateuco', 'Históricos', 'Poéticos', 'Profetas maiores', 'Profetas menores'],
  ['Evangelhos', 'Histórico', 'Cartas paulinas', 'Cartas pastorais', 'Carta pessoal', 'Cartas gerais', 'Apocalíptico'],
]
const intervals = [
  { label: 'Séculos VIII–VII a.C.', min: -800, max: -601 },
  { label: 'Séculos VI–V a.C.', min: -600, max: -401 },
  { label: 'Séculos IV–II a.C.', min: -400, max: -100 },
  { label: 'Século I d.C. · até 69', min: 1, max: 69 },
  { label: 'Século I d.C. · 70–100', min: 70, max: 100 },
  { label: 'Início do século II d.C.', min: 101, max: 130 },
]
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const matches = (book: BookRecord, q: string) => normalize(`${book.title} ${book.authorshipLabel} ${book.category} ${book.description}`).includes(q)

export default function BooksPage() {
  const [view, setView] = useState<View>('canon')
  const [testament, setTestament] = useState<'all' | 'AT' | 'NT'>('all')
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => books.filter((book) => (testament === 'all' || book.testament === testament) && matches(book, normalize(query))), [testament, query])
  const dated = useMemo(() => filtered.filter((book) => book.compositionStartYear !== undefined).sort((a, b) => a.compositionStartYear! - b.compositionStartYear! || a.canonOrder - b.canonOrder), [filtered])
  const undated = filtered.filter((book) => book.compositionStartYear === undefined)
  return <div className="books-page">
    <Breadcrumbs items={[{ label: 'Início', href: '/' }, { label: 'Livros bíblicos' }]} />
    <header className="books-intro">
      <div><span className="eyebrow">BIBLIOTECA BÍBLICA</span><h1>Os livros da Bíblia</h1><p>Consulte a organização dos 66 livros do cânon protestante e as propostas de autoria e composição. As datas não são uma sequência exata: muitos textos foram formados em etapas.</p></div>
      <EditorialImage image={editorialImages.manuscripts} />
    </header>
    <div className="books-explainer" role="note"><CalendarRange size={21} /><div><strong>Duas cronologias diferentes</strong><p><b>Contexto narrado</b> é a época dos acontecimentos ou destinatários. <b>Composição</b> é quando o texto pode ter sido escrito ou reunido. A ordenação abaixo usa o início aproximado da faixa de composição, sem afirmar a precedência exata de livros com intervalos sobrepostos.</p></div></div>
    <div className="books-toolbar"><div className="books-view" role="group" aria-label="Organização dos livros"><button className={view === 'canon' ? 'active' : ''} aria-pressed={view === 'canon'} onClick={() => setView('canon')}>Ordem bíblica</button><button className={view === 'composition' ? 'active' : ''} aria-pressed={view === 'composition'} onClick={() => setView('composition')}>Composição estimada</button></div><div className="books-testament" role="group" aria-label="Filtrar testamento">{([['all', 'Todos'], ['AT', 'Antigo'], ['NT', 'Novo']] as const).map(([id, label]) => <button key={id} className={testament === id ? 'active' : ''} aria-pressed={testament === id} onClick={() => setTestament(id)}>{label}</button>)}</div><label className="books-search"><Search size={16} /><span className="sr-only">Buscar livros ou autores</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Livro ou autor..." /></label></div>
    <p className="books-count">{filtered.length} {filtered.length === 1 ? 'livro' : 'livros'} nesta consulta</p>
    {view === 'canon' ? <div className="canon-columns">{(['AT', 'NT'] as const).filter((item) => testament === 'all' || testament === item).map((item) => <section className="canon-testament" key={item}><div className="canon-heading"><span className="eyebrow">{item === 'AT' ? '39 LIVROS' : '27 LIVROS'}</span><h2>{item === 'AT' ? 'Antigo Testamento' : 'Novo Testamento'}</h2></div>{(canonGroups[item === 'AT' ? 0 : 1] ?? []).map((category) => { const group = filtered.filter((book) => book.testament === item && book.category === category); return group.length > 0 && <div className="canon-group" key={category}><h3>{category}</h3><div className="canon-list">{group.map((book) => <BookRow key={book.id} book={book} />)}</div></div> })}</section>)}</div> : <div className="composition-list"><div className="composition-intro"><h2>Linha cronológica da composição</h2><p>Faixas amplas; um mesmo intervalo pode abranger várias etapas. Os livros sem data única aparecem ao final.</p></div>{intervals.map((interval) => { const group = dated.filter((book) => book.compositionStartYear! >= interval.min && book.compositionStartYear! <= interval.max);return group.length > 0 && <section className="composition-era" key={interval.label}><div className="composition-era-label"><span>{interval.label}</span><small>{group.length} {group.length === 1 ? 'livro' : 'livros'}</small></div><div className="composition-era-items">{group.map((book) => <BookRow key={book.id} book={book} showDate />)}</div></section>})}{undated.length > 0 && <section className="composition-era undated"><div className="composition-era-label"><span>Sem data única</span><small>{undated.length} {undated.length === 1 ? 'livro' : 'livros'}</small></div><div className="composition-era-items">{undated.map((book) => <BookRow key={book.id} book={book} showDate />)}</div></section>}</div>}
    {!filtered.length && <div className="empty-state"><BookOpenText size={24} /><h2>Nenhum livro encontrado</h2><p>Experimente outro nome ou retire um filtro.</p></div>}
    <div className="books-method"><strong>Como ler as datas</strong><p>Atribuições tradicionais são identificadas como tradição. Para coleções e obras de redação debatida, não há um ano único. A linha de composição usa intervalos editoriais amplos que variam entre pesquisadores; abra a ficha para referências. O cânon mostrado reúne 39 livros do Antigo e 27 do Novo Testamento, conforme a organização protestante.</p><a href="https://www.americanbible.org/engage/bible-resources/articles/the-new-testament/" target="_blank" rel="noreferrer">American Bible Society: Novo Testamento ↗</a><a href="https://www.bibleodyssey.org/articles/why-does-the-bible-look-the-way-it-does/" target="_blank" rel="noreferrer">Bible Odyssey: organização bíblica ↗</a></div>
  </div>
}

function BookRow({ book, showDate = false }: { book: BookRecord; showDate?: boolean }) {
  const range = book.compositionStartYear === undefined ? 'Data única não estabelecida' : `${formatYear(book.compositionStartYear)} – ${formatYear(book.compositionEndYear ?? book.compositionStartYear)}`
  return <Link className="book-row" to={`/livro/${book.slug}`}><span className="book-row-order">{String(book.canonOrder).padStart(2, '0')}</span><span className="book-row-main"><strong>{book.title}</strong><small>{showDate ? book.category : book.authorshipLabel}</small></span><span className="book-row-date">{showDate ? range : book.compositionStartYear === undefined ? 'Composição debatida' : range}</span><span aria-hidden="true">↗</span></Link>
}
