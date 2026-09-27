import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { BookOpenText, Clock3, MapPin, Search, UserRound, X } from 'lucide-react'
import { searchCatalog } from '../services/searchService'
import type { EntityType, SearchResult } from '../types'

const iconByType: Record<EntityType, typeof Search> = {
  event: Clock3,
  person: UserRound,
  book: BookOpenText,
  place: MapPin,
  empire: BookOpenText,
}

const typeLabel: Record<EntityType, string> = { event: 'Evento', person: 'Personagem', book: 'Livro', place: 'Lugar', empire: 'Império' }

export function SearchBox() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const results = searchCatalog(query)

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const esc = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc) }
  }, [])

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        const input = rootRef.current?.querySelector('input')
        if (input && input.getClientRects().length > 0) {
          event.preventDefault()
          input.focus()
          setOpen(true)
        }
      }
    }
    document.addEventListener('keydown', shortcut)
    return () => document.removeEventListener('keydown', shortcut)
  }, [])

  return (
    <div className="search-wrap" ref={rootRef}>
      <div className={`search-field ${open ? 'focused' : ''}`}>
        <Search size={17} className="search-icon" />
        <input aria-label="Buscar na cronologia" placeholder="Buscar pessoas, eventos, livros..." value={query} onFocus={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); setOpen(true) }} />
        {query && <button className="search-clear" aria-label="Limpar busca" onClick={() => setQuery('')}><X size={14} /></button>}
        <kbd>Ctrl K</kbd>
      </div>
      {open && query.trim().length >= 2 && (
        <div className="search-popover">
          <div className="popover-label">{results.length ? 'RESULTADOS' : 'SEM RESULTADOS'}</div>
          {results.length ? results.map((result) => <SearchOption key={`${result.type}-${result.id}`} result={result} onClick={() => { setOpen(false); setQuery('') }} />) : <p className="empty-search">Tente outro nome ou termo.</p>}
          <div className="search-hint">Busca aproximada em eventos, personagens, livros e lugares</div>
        </div>
      )}
    </div>
  )
}

function SearchOption({ result, onClick }: { result: SearchResult; onClick: () => void }) {
  const Icon = iconByType[result.type]
  return <Link to={result.href} onClick={onClick} className="search-option"><span className="search-option-icon"><Icon size={16} /></span><span className="search-option-copy"><strong>{result.title}</strong><small>{result.subtitle}</small></span><span className="search-type">{typeLabel[result.type]}</span></Link>
}
