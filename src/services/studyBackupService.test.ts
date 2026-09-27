import { describe, expect, it } from 'vitest'
import { parseStudyBackup } from './studyBackupService'

const example = {
  format: 'cronologia-biblica-study', version: 1, exportedAt: '2026-09-27T00:00:00.000Z',
  favorites: [{ type: 'event', id: 'call-of-abraham', savedAt: 100 }],
  notes: [{ id: 'note-1', type: 'event', entityId: 'call-of-abraham', text: 'Estudar Gênesis 12', updatedAt: 101 }],
  presets: [{ id: 'view-1', name: 'Patriarcas', periodId: 'patriarchs', layers: ['events', 'persons'] }],
}

describe('cópia do estudo', () => {
  it('aceita favoritos, notas e visões salvas compatíveis', () => {
    expect(parseStudyBackup(JSON.stringify(example)).notes[0]?.text).toBe('Estudar Gênesis 12')
  })
  it('recusa arquivos de outros formatos e itens desconhecidos', () => {
    expect(() => parseStudyBackup(JSON.stringify({ ...example, version: 2 }))).toThrow('Formato')
    expect(() => parseStudyBackup(JSON.stringify({ ...example, favorites: [{ type: 'event', id: 'desconhecido', savedAt: 1 }] }))).toThrow('incompatíveis')
  })
  it('recusa notas grandes e JSON inválido', () => {
    expect(() => parseStudyBackup(JSON.stringify({ ...example, notes: [{ ...example.notes[0], text: 'x'.repeat(10001) }] }))).toThrow('incompatíveis')
    expect(() => parseStudyBackup('{')).toThrow('JSON válido')
  })
})
