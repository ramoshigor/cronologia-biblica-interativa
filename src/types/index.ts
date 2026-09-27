export type DateType = 'exact' | 'approximate' | 'disputed' | 'range' | 'unknown'
export type EntityType = 'event' | 'person' | 'book' | 'place' | 'empire'

export interface BiblicalReference {
  book: string
  chapter: number
  verseStart?: number
  verseEnd?: number
  label: string
}

export interface Source {
  id: string
  title: string
  author?: string
  publisher?: string
  url?: string
  note?: string
}

export interface Period {
  id: string
  title: string
  shortTitle: string
  startYear: number
  endYear: number
  dateLabel: string
  description: string
  color: string
  icon: string
}

export interface TimelineEntity {
  id: string
  slug: string
  title: string
  shortDescription: string
  startYear: number
  endYear?: number
  dateLabel: string
  dateType: DateType
  references: BiblicalReference[]
}

export interface EventRecord extends TimelineEntity {
  description: string
  periodId: string
  category: 'event' | 'kingdom' | 'journey' | 'covenant' | 'ministry'
  personIds: string[]
  placeIds: string[]
  empireIds: string[]
  relatedEventIds: string[]
  sourceIds: string[]
}

export interface Person extends TimelineEntity {
  role: string
  description: string
  birthYear: number
  deathYear?: number
  eventIds: string[]
  bookIds: string[]
  placeIds: string[]
  family?: string[]
  sourceIds: string[]
}

export interface BookRecord {
  id: string
  slug: string
  title: string
  testament: 'AT' | 'NT'
  category: string
  periodId: string
  narrativeStartYear: number
  narrativeEndYear: number
  compositionLabel?: string
  description: string
  references: BiblicalReference[]
  personIds: string[]
  sourceIds: string[]
}

export interface Place {
  id: string
  slug: string
  title: string
  shortDescription: string
  description: string
  references: BiblicalReference[]
}

export interface Empire {
  id: string
  title: string
  startYear: number
  endYear: number
  dateLabel: string
  color: string
}

export interface Relationship {
  id: string
  sourceType: EntityType
  sourceId: string
  targetType: EntityType
  targetId: string
  relationshipType: string
}

export interface Favorite {
  type: EntityType
  id: string
  savedAt: number
}

export interface StudyNote {
  id: string
  type: EntityType
  entityId: string
  text: string
  updatedAt: number
}

export interface SearchResult {
  type: EntityType
  id: string
  slug: string
  title: string
  subtitle: string
  href: string
}
