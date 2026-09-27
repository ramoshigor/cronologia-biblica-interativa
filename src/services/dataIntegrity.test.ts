import { beforeEach, describe, expect, it } from 'vitest'
import { empires, events, persons, places, sources } from '../repositories/catalogRepository'
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
