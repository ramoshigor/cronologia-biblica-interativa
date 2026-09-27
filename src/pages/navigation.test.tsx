// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { createMemoryRouter, RouterProvider } from 'react-router'
import ExplorePage from './ExplorePage'
import TimelinePage from './TimelinePage'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let root: Root | undefined
let host: HTMLDivElement | undefined

afterEach(async () => {
  if (root) await act(async () => root!.unmount())
  host?.remove()
  root = undefined
  host = undefined
})

async function renderAt(path: string, element: React.ReactNode) {
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
  const router = createMemoryRouter([{ path: '/explorar', element }, { path: '/linha-do-tempo', element }], { initialEntries: [path] })
  await act(async () => root!.render(<RouterProvider router={router} />))
  return router
}

describe('navegação por endereço', () => {
  it('atualiza a aba ao voltar no histórico', async () => {
    const router = await renderAt('/explorar?tab=personagens', <ExplorePage />)
    expect(host!.querySelector('[role="group"][aria-label="Categoria de conteúdo"] button[aria-pressed="true"]')?.textContent).toContain('Personagens')
    await act(async () => router.navigate('/explorar?tab=lugares'))
    expect(host!.querySelector('[role="group"][aria-label="Categoria de conteúdo"] button[aria-pressed="true"]')?.textContent).toContain('Lugares')
    await act(async () => router.navigate(-1))
    expect(host!.querySelector('[role="group"][aria-label="Categoria de conteúdo"] button[aria-pressed="true"]')?.textContent).toContain('Personagens')
  })

  it('mostra o império indicado pela busca e a lista por período', async () => {
    await renderAt('/linha-do-tempo?imp=babylon-empire', <TimelinePage />)
    expect(host!.querySelector('.empire-focus')?.textContent).toContain('Babilônia')
    expect(host!.querySelectorAll('.mobile-period').length).toBeGreaterThan(0)
  })
})
