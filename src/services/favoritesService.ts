import { storageService } from './storageService'
import type { EntityType, Favorite } from '../types'

const KEY = 'cronologia:favorites:v1'

export const favoritesService = {
  list(): Favorite[] { return storageService.read<Favorite[]>(KEY, []) },
  has(type: EntityType, id: string): boolean { return this.list().some((item) => item.type === type && item.id === id) },
  toggle(type: EntityType, id: string): boolean {
    const current = this.list()
    const exists = current.some((item) => item.type === type && item.id === id)
    const next = exists ? current.filter((item) => !(item.type === type && item.id === id)) : [...current, { type, id, savedAt: Date.now() }]
    storageService.write(KEY, next)
    return !exists
  },
}
