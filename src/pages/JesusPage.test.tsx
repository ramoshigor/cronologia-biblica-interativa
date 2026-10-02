// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { createMemoryRouter, RouterProvider } from 'react-router'
import PersonPage from './PersonPage'
import { jesusJourney } from './JesusPage'
import { events, persons } from '../repositories/catalogRepository'
import { imageForEvent } from '../media/manifest'
import { searchCatalog } from '../services/searchService'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let root: Root | undefined
let host: HTMLDivElement | undefined
afterEach(async () => {
  if (root) await act(async () => root!.unmount())
  host?.remove()
  root = undefined
})

describe('consulta da vida de Jesus', () => {
  it('mantém os momentos conectados ao catálogo, à busca e às imagens', () => {
    const jesus = persons.find((person) => person.id === 'jesus')!
    for (const step of jesusJourney) {
      const event = events.find((item) => item.id === step.id)!
      expect(event).toBeDefined()
      expect(event.personIds).toContain('jesus')
      expect(jesus.eventIds).toContain(event.id)
      expect(imageForEvent[event.id]).toBeDefined()
      expect(event.references.length).toBeGreaterThan(0)
    }
    expect(searchCatalog('Sermão do Monte').some((item) => item.id === 'sermon-mount')).toBe(true)
    // O endereço publicado anteriormente continua válido após separar os relatos.
    expect(events.find((event) => event.slug === 'morte-e-ressurreicao-de-jesus')?.id).toBe('crucifixion')
  })

  it('filtra as etapas, restaura o percurso e oferece os quatro Evangelhos', async () => {
    host = document.createElement('div')
    document.body.append(host)
    root = createRoot(host)
    const router = createMemoryRouter([{ path: '/personagem/:slug', element: <PersonPage /> }], { initialEntries: ['/personagem/jesus'] })
    await act(async () => root!.render(<RouterProvider router={router} />))
    expect(host.querySelectorAll('.jesus-moment-card')).toHaveLength(8)
    expect(host.querySelectorAll('.jesus-gospel-card')).toHaveLength(4)
    const filters = host.querySelectorAll<HTMLButtonElement>('.jesus-phase-filters button')
    await act(async () => filters[2]!.click())
    expect(filters[2]!.getAttribute('aria-pressed')).toBe('true')
    expect([...host.querySelectorAll('.jesus-moment-card h3')].map((item) => item.textContent)).toEqual(['Chamado dos primeiros discípulos', 'Sermão do Monte'])
    await act(async () => filters[3]!.click())
    expect(host.querySelectorAll('.jesus-moment-card')).toHaveLength(4)
    expect(host.querySelector('.jesus-moment-card h3')?.textContent).toBe('Última ceia')
    expect(host.querySelector('[role="status"]')?.textContent).toContain('4 acontecimentos')
    await act(async () => filters[0]!.click())
    expect(host.querySelectorAll('.jesus-moment-card')).toHaveLength(8)
    expect(host.textContent).not.toContain('Minhas anotações')
  })
})
