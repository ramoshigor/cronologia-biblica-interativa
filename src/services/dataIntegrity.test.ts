import { beforeEach, describe, expect, it } from 'vitest'
import { books, empires, events, persons, places, sources } from '../repositories/catalogRepository'
import { searchCatalog } from './searchService'
import { favoritesService } from './favoritesService'
import { notesService } from './notesService'

describe('initial historical sample', () => {
  it('keeps event relations connected to records and sources', () => {
    const people = new Set(persons.map((item) => item.id))
    const placeIds = new Set(places.map((item) => item.id))
    const empireIds = new Set(empires.map((item) => item.id))
    const eventIds = new Set(events.map((item) => item.id))
    const sourceIds = new Set(sources.map((item) => item.id))
    for (const event of events) {
      expect(event.startYear).not.toBe(0)
      expect(['exact', 'approximate', 'disputed', 'range', 'unknown']).toContain(event.dateType)
      expect(event.personIds.every((id) => people.has(id))).toBe(true)
      expect(event.placeIds.every((id) => placeIds.has(id))).toBe(true)
      expect(event.empireIds.every((id) => empireIds.has(id))).toBe(true)
      expect(event.relatedEventIds.every((id) => eventIds.has(id))).toBe(true)
      expect(event.sourceIds.every((id) => sourceIds.has(id))).toBe(true)
      expect(event.references.length).toBeGreaterThan(0)
    }
  })

  it('searches fuzzy names and returns records grouped by type', () => {
    const results = searchCatalog('Jeremais')
    expect(results.some((item) => item.type === 'person' && item.title === 'Jeremias')).toBe(true)
    expect(results.some((item) => item.type === 'book' && item.title === 'Jeremias')).toBe(true)
  })
})

describe('consultation catalog', () => {
  it('keeps person links, narrative periods and activity intervals valid', () => {
    const personIds = new Set(persons.map((item) => item.id))
    const bookIds = new Set(books.map((item) => item.id))
    const placeIds = new Set(places.map((item) => item.id))
    const eventIds = new Set(events.map((item) => item.id))
    const sourceIds = new Set(sources.map((item) => item.id))
    expect(personIds.size).toBe(persons.length)
    for (const person of persons) {
      expect(person.bookIds.every((id) => bookIds.has(id))).toBe(true)
      expect(person.placeIds.every((id) => placeIds.has(id))).toBe(true)
      expect(person.eventIds.every((id) => eventIds.has(id))).toBe(true)
      expect(person.sourceIds.every((id) => sourceIds.has(id))).toBe(true)
      expect((person.family ?? []).every((id) => personIds.has(id))).toBe(true)
      expect(person.references.length).toBeGreaterThan(0)
      expect(person.endYear ?? person.startYear).toBeGreaterThanOrEqual(person.startYear)
      if (person.dateBasis === 'activity') {
        expect(person.birthYear).toBeUndefined()
        expect(person.deathYear).toBeUndefined()
      }
    }
    expect(searchCatalog('Débora').some((item) => item.id === 'deborah')).toBe(true)
    expect(searchCatalog('Apolo').some((item) => item.id === 'apollos')).toBe(true)
  })
  it('contains the 66 books in canonical order with valid references and conservative composition dates', () => {
    expect(books).toHaveLength(66)
    expect(books.filter((book) => book.testament === 'AT')).toHaveLength(39)
    expect(books.filter((book) => book.testament === 'NT')).toHaveLength(27)
    const people = new Set(persons.map((person) => person.id))
    const sourceIds = new Set(sources.map((source) => source.id))
    for (const [index, book] of books.entries()) {
      expect(book.canonOrder).toBe(index + 1)
      expect(book.authorshipLabel.length).toBeGreaterThan(2)
      expect(book.references.length).toBeGreaterThan(0)
      expect(book.personIds.every((id) => people.has(id))).toBe(true)
      expect(book.sourceIds.every((id) => sourceIds.has(id))).toBe(true)
      if (book.compositionStartYear !== undefined) {
        expect(book.compositionEndYear).toBeGreaterThanOrEqual(book.compositionStartYear)
        expect(book.compositionStartYear).not.toBe(0)
      }
    }
    expect(books.find((book) => book.id === 'hebrews')?.authorshipLabel).toContain('não identificado')
  })

  it('links Melchizedek to the narrative without inventing his lifespan', () => {
    const person = persons.find((item) => item.id === 'melchizedek')
    expect(person?.birthYear).toBeUndefined()
    expect(person?.eventIds).toContain('melchizedek-meets-abraham')
    expect(person?.references.map((reference) => reference.book)).toEqual(['Gênesis', 'Salmos', 'Hebreus'])
    expect(persons.every((item) => item.eventIds.every((id) => events.some((event) => event.id === id)))).toBe(true)
  })
})

describe('local study storage', () => {
  beforeEach(() => localStorage.clear())

  it('toggles favorites in local storage', () => {
    expect(favoritesService.toggle('event', 'jerusalem-fall')).toBe(true)
    expect(favoritesService.has('event', 'jerusalem-fall')).toBe(true)
    expect(favoritesService.toggle('event', 'jerusalem-fall')).toBe(false)
    expect(favoritesService.list()).toHaveLength(0)
  })

  it('saves and removes notes for an entity', () => {
    const note = notesService.save('person', 'david', 'Relacionar com 2 Samuel 5.')
    expect(notesService.forEntity('person', 'david')).toHaveLength(1)
    expect(notesService.forEntity('event', 'david')).toHaveLength(0)
    notesService.remove(note.id)
    expect(notesService.forEntity('person', 'david')).toHaveLength(0)
  })
})
