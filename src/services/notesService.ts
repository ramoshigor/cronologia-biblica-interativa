import { storageService } from './storageService'
import type { EntityType, StudyNote } from '../types'

const KEY = 'cronologia:notes:v1'

export const notesService = {
  list(): StudyNote[] { return storageService.read<StudyNote[]>(KEY, []) },
  forEntity(type: EntityType, entityId: string): StudyNote[] {
    return this.list().filter((note) => note.type === type && note.entityId === entityId).sort((a, b) => b.updatedAt - a.updatedAt)
  },
  save(type: EntityType, entityId: string, text: string): StudyNote {
    const current = this.list()
    const note: StudyNote = { id: crypto.randomUUID(), type, entityId, text, updatedAt: Date.now() }
    storageService.write(KEY, [note, ...current])
    return note
  },
  remove(id: string): void {
    storageService.write(KEY, this.list().filter((note) => note.id !== id))
  },
}
