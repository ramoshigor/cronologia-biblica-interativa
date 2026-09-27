import Fuse from 'fuse.js'
import { books, empires, events, persons, places } from '../repositories/catalogRepository'
import type { SearchResult } from '../types'

const all: SearchResult[] = [
  ...events.map((item) => ({ type: 'event' as const, id: item.id, slug: item.slug, title: item.title, subtitle: `${item.dateLabel} · Evento`, href: `/evento/${item.slug}` })),
  ...persons.map((item) => ({ type: 'person' as const, id: item.id, slug: item.slug, title: item.title, subtitle: `${item.role} · ${item.dateLabel}`, href: `/personagem/${item.slug}` })),
  ...books.map((item) => ({ type: 'book' as const, id: item.id, slug: item.slug, title: item.title, subtitle: `${item.testament === 'AT' ? 'Antigo' : 'Novo'} Testamento · ${item.category}`, href: `/livro/${item.slug}` })),
  ...places.map((item) => ({ type: 'place' as const, id: item.id, slug: item.slug, title: item.title, subtitle: 'Lugar bíblico', href: `/lugar/${item.slug}` })),
  ...empires.map((item) => ({ type: 'empire' as const, id: item.id, slug: item.id, title: item.title, subtitle: `${item.dateLabel} · Império`, href: `/linha-do-tempo?imp=${item.id}` })),
]

const fuse = new Fuse(all, { keys: ['title', 'subtitle'], threshold: 0.35, ignoreLocation: true, minMatchCharLength: 2 })

export function searchCatalog(query: string): SearchResult[] {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []
  return fuse.search(trimmed, { limit: 12 }).map((item) => item.item)
}

export function getSearchIndex(): SearchResult[] { return all }
