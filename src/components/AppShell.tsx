import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { BookOpenText, Clock3, Compass, GitCompareArrows, Menu, X } from 'lucide-react'
import { SearchBox } from './SearchBox'

const navigation = [
  { to: '/', label: 'Início', icon: Compass, end: true },
  { to: '/linha-do-tempo', label: 'Cronologia', icon: Clock3 },
  { to: '/explorar', label: 'Explorar', icon: BookOpenText },
  { to: '/comparar', label: 'Comparar', icon: GitCompareArrows },
  { to: '/livros', label: 'Livros', icon: BookOpenText },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)
  const location = useLocation()
  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update) }
  }, [])
  return (
    <div className="app-frame" style={{ backgroundImage: `linear-gradient(#f8f6f0f3, #f8f6f0f3), url(${import.meta.env.BASE_URL}media/v2/textura-papel.webp)` }}>
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand" aria-label="Cronologia Bíblica Interativa — início" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark"><span>✦</span></span>
            <span className="brand-copy"><strong>Cronologia</strong><small>BÍBLICA INTERATIVA</small></span>
          </Link>
          <nav className={`main-nav ${menuOpen ? 'open' : ''}`} aria-label="Navegação principal">
            {navigation.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Icon size={16} strokeWidth={1.8} /><span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="topbar-search"><SearchBox /></div>
          <button className="mobile-menu icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>
      {!isOnline && <div className="offline-banner"><span className="offline-dot" /> Você está offline. O conteúdo já carregado continua disponível.</div>}
      <main id="conteudo" className="page-shell" key={location.pathname}>
        {children}
      </main>
      <footer className="site-footer">
        <span>Um atlas para acompanhar a grande história bíblica.</span>
        <span className="footer-meta"><span className="status-dot" /> 66 livros · datas e autorias indicadas conforme sua precisão</span>
      </footer>
      <div className="mobile-search"><SearchBox /></div>
    </div>
  )
}
