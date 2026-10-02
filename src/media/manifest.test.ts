import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { editorialImages } from './manifest'

describe('arquivos de ilustração publicados', () => {
  it('mantém arquivos WebP completos nas versões para celular e desktop', () => {
    for (const image of Object.values(editorialImages)) {
      for (const suffix of ['', '-sm']) {
        const path = `public/media/v2/${image.file}${suffix}.webp`
        const bytes = readFileSync(path)
        expect(bytes.length, path).toBeGreaterThan(1000)
        expect(bytes.toString('ascii', 0, 4), path).toBe('RIFF')
        expect(bytes.toString('ascii', 8, 12), path).toBe('WEBP')
        expect(bytes.readUInt32LE(4) + 8, path).toBe(bytes.length)
      }
    }
  })
})
