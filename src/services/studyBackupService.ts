import { books, empires, events, persons, places, periods } from '../repositories/catalogRepository'
import { storageService } from './storageService'
import type { EntityType, Favorite, StudyNote } from '../types'

const FAVORITES = 'cronologia:favorites:v1'
const NOTES = 'cronologia:notes:v1'
const PRESETS = 'cronologia:timeline-presets:v1'
const types: EntityType[] = ['event', 'person', 'book', 'place', 'empire']
const layers = ['events', 'persons', 'empires', 'books']
const ids: Record<EntityType, Set<string>> = {
  event: new Set(events.map((item) => item.id)),
  person: new Set(persons.map((item) => item.id)),
  book: new Set(books.map((item) => item.id)),
  place: new Set(places.map((item) => item.id)),
  empire: new Set(empires.map((item) => item.id)),
}

export interface StudyBackup {
  format: 'cronologia-biblica-study'
  version: 1
  exportedAt: string
  favorites: Favorite[]
  notes: StudyNote[]
  presets: Array<{ id: string; name: string; periodId?: string; layers: Array<'events' | 'persons' | 'empires' | 'books'> }>
}

const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
const date = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
const entity = (value: Record<string, unknown>, key: 'id' | 'entityId') =>
  typeof value.type === 'string' && types.includes(value.type as EntityType) && typeof value[key] === 'string' && ids[value.type as EntityType].has(value[key] as string)

export function parseStudyBackup(input: string): StudyBackup {
  if (input.length > 1_000_000) throw new Error('O arquivo excede o limite de 1 MB.')
  let value: unknown
  try { value = JSON.parse(input) } catch { throw new Error('O arquivo não contém JSON válido.') }
  if (!record(value) || value.format !== 'cronologia-biblica-study' || value.version !== 1 ||
      !Array.isArray(value.favorites) || !Array.isArray(value.notes) || !Array.isArray(value.presets) ||
      value.favorites.length > 1000 || value.notes.length > 1000 || value.presets.length > 100) {
    throw new Error('Formato de cópia de segurança não reconhecido.')
  }
  const validFavorites = value.favorites.every((item: unknown) => record(item) && entity(item, 'id') && date(item.savedAt))
  const validNotes = value.notes.every((item: unknown) => record(item) && typeof item.id === 'string' && item.id.length <= 100 &&
    entity(item, 'entityId') && typeof item.text === 'string' && item.text.length <= 10000 && date(item.updatedAt))
  const validPresets = value.presets.every((item: unknown) => record(item) && typeof item.id === 'string' && item.id.length <= 100 &&
    typeof item.name === 'string' && item.name.trim().length > 0 && item.name.length <= 100 &&
    (item.periodId === undefined || (typeof item.periodId === 'string' && periods.some((period) => period.id === item.periodId))) &&
    Array.isArray(item.layers) && item.layers.length <= 4 && item.layers.every((layer: unknown) => typeof layer === 'string' && layers.includes(layer)))
  if (!validFavorites || !validNotes || !validPresets) throw new Error('O arquivo contém itens incompatíveis com este catálogo.')
  return value as unknown as StudyBackup
}

export const studyBackupService = {
  export(): StudyBackup {
    return {
      format: 'cronologia-biblica-study', version: 1, exportedAt: new Date().toISOString(),
      favorites: storageService.read<Favorite[]>(FAVORITES, []),
      notes: storageService.read<StudyNote[]>(NOTES, []),
      presets: storageService.read<StudyBackup['presets']>(PRESETS, []),
    }
  },
  restore(backup: StudyBackup) {
    storageService.write(FAVORITES, backup.favorites)
    storageService.write(NOTES, backup.notes)
    storageService.write(PRESETS, backup.presets)
  },
}
