import eventsData from '../data/events.json'
import personsData from '../data/persons.json'
import booksData from '../data/books.json'
import placesData from '../data/places.json'
import periodsData from '../data/periods.json'
import empiresData from '../data/empires.json'
import relationshipsData from '../data/relationships.json'
import sourcesData from '../data/sources.json'
import type { BookRecord, Empire, EventRecord, Period, Person, Place, Relationship, Source } from '../types'

export interface CatalogRepository {
  getEvents(): EventRecord[]
  getPersons(): Person[]
  getBooks(): BookRecord[]
  getPlaces(): Place[]
  getPeriods(): Period[]
  getEmpires(): Empire[]
  getRelationships(): Relationship[]
  getSources(): Source[]
}

/** The UI depends on this interface, so static JSON can later be replaced by an API repository. */
export const localCatalogRepository: CatalogRepository = {
  getEvents: () => eventsData as EventRecord[],
  getPersons: () => personsData as Person[],
  getBooks: () => booksData as BookRecord[],
  getPlaces: () => placesData as Place[],
  getPeriods: () => periodsData as Period[],
  getEmpires: () => empiresData as Empire[],
  getRelationships: () => relationshipsData as Relationship[],
  getSources: () => sourcesData as Source[],
}

export const events = localCatalogRepository.getEvents()
export const persons = localCatalogRepository.getPersons()
export const books = localCatalogRepository.getBooks()
export const places = localCatalogRepository.getPlaces()
export const periods = localCatalogRepository.getPeriods()
export const empires = localCatalogRepository.getEmpires()
export const relationships = localCatalogRepository.getRelationships()
export const sources = localCatalogRepository.getSources()

export function getEvent(slug: string): EventRecord | undefined { return events.find((item) => item.slug === slug) }
export function getPerson(slug: string): Person | undefined { return persons.find((item) => item.slug === slug) }
export function getBook(slug: string): BookRecord | undefined { return books.find((item) => item.slug === slug) }
export function getPlace(slug: string): Place | undefined { return places.find((item) => item.slug === slug) }
export function getPeriod(id: string): Period | undefined { return periods.find((item) => item.id === id) }
