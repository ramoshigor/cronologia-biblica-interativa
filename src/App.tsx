import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AppShell } from './components/AppShell'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingPage } from './components/Shared'

const HomePage = lazy(() => import('./pages/HomePage'))
const TimelinePage = lazy(() => import('./pages/TimelinePage'))
const EventPage = lazy(() => import('./pages/EventPage'))
const PersonPage = lazy(() => import('./pages/PersonPage'))
const ComparePage = lazy(() => import('./pages/ComparePage'))
const ExplorePage = lazy(() => import('./pages/ExplorePage'))
const BooksPage = lazy(() => import('./pages/BooksPage'))
const BookPage = lazy(() => import('./pages/BookPage'))
const PlacePage = lazy(() => import('./pages/PlacePage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <AppShell>
        <ErrorBoundary>
          <Suspense fallback={<LoadingPage />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/linha-do-tempo" element={<TimelinePage />} />
              <Route path="/evento/:slug" element={<EventPage />} />
              <Route path="/personagem/:slug" element={<PersonPage />} />
              <Route path="/comparar" element={<ComparePage />} />
              <Route path="/explorar" element={<ExplorePage />} />
              <Route path="/favoritos" element={<Navigate to="/explorar" replace />} />
              <Route path="/livros" element={<BooksPage />} />
              <Route path="/livro/:slug" element={<BookPage />} />
              <Route path="/lugar/:slug" element={<PlacePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </AppShell>
    </BrowserRouter>
  )
}
