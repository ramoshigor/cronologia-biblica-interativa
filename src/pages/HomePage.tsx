import { ArrowRight, BookOpenText, Compass, GitCompareArrows, Map, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import { periods, events, persons } from '../repositories/catalogRepository'
import { historyService } from '../services/historyService'
import { SectionHeading } from '../components/Shared'
import { formatYear } from '../utils/dates'

export default function HomePage() {
  const recent = historyService.list()
  const continueItems = recent.length ? recent.slice(0, 3) : [{ type: 'event' as const, id: 'jerusalem-fall', slug: 'queda-de-jerusalem', title: 'Queda de Jerusalém', href: '/evento/queda-de-jerusalem', viewedAt: 0 }]
  const featured = events.find((event) => event.id === 'jerusalem-fall')!
  return <div className="home-page">
    <section className="hero-card">
      <div className="hero-copy">
        <span className="hero-kicker"><span className="gold-dot" /> ATLAS HISTÓRICO BÍBLICO</span>
        <h1>A grande história bíblica em uma <em>linha do tempo.</em></h1>
        <p>Enxergue os acontecimentos, personagens e livros no mesmo contexto histórico — e siga as conexões de um período a outro.</p>
        <div className="hero-actions"><Link to="/linha-do-tempo" className="button button-gold">Explorar cronologia <ArrowRight size={17} /></Link><Link to="/explorar" className="button button-quiet">Conhecer o conteúdo</Link></div>
        <div className="hero-footnote"><span className="status-dot" /> Datas com indicação de precisão e referências bíblicas</div>
      </div>
      <div className="hero-art" aria-label="Ilustração abstrata de uma linha do tempo histórica" role="img">
        <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-sun" />
        <div className="art-scripture">בְּרֵאשִׁית<br /><span>no princípio</span></div>
        <div className="art-line"><span className="art-point point-one" /><span className="art-point point-two" /><span className="art-point point-three" /><span className="art-point point-four" /></div>
        <span className="art-label label-top">PATRIARCAS</span><span className="art-label label-mid">REINO</span><span className="art-label label-low">IGREJA</span>
        <span className="art-year year-one">c. 2000 a.C.</span><span className="art-year year-two">c. 1000 a.C.</span><span className="art-year year-three">30 d.C.</span>
        <div className="art-card"><span className="art-card-icon">✦</span><span><strong>Uma história conectada</strong><small>Eventos · Pessoas · Livros</small></span></div>
      </div>
    </section>

    <section className="home-shortcuts" aria-label="Atalhos de navegação">
      <Link to="/linha-do-tempo" className="shortcut-card"><span className="shortcut-icon sand"><Map size={19} /></span><span><strong>Linha do tempo</strong><small>Navegue entre períodos</small></span><ArrowRight size={16} /></Link>
      <Link to="/explorar?tab=personagens" className="shortcut-card"><span className="shortcut-icon olive"><BookOpenText size={19} /></span><span><strong>Personagens</strong><small>Explore vidas e relações</small></span><ArrowRight size={16} /></Link>
      <Link to="/comparar" className="shortcut-card"><span className="shortcut-icon blue"><GitCompareArrows size={19} /></span><span><strong>Comparar</strong><small>Veja quem viveu junto</small></span><ArrowRight size={16} /></Link>
    </section>

    <section className="home-section eras-section">
      <SectionHeading eyebrow="PERCORRA A NARRATIVA" title="Eras da história bíblica" description="Escolha um período e veja o que acontecia ao redor." action={<Link to="/linha-do-tempo" className="text-link">Abrir cronologia <ArrowRight size={15} /></Link>} />
      <div className="era-grid">{periods.map((period, index) => <Link key={period.id} to={`/linha-do-tempo?period=${period.id}`} className="era-card" style={{ '--era-color': period.color } as React.CSSProperties}>
        <div className="era-card-top"><span className="era-icon">{period.icon}</span><span className="era-index">{String(index + 1).padStart(2, '0')}</span></div>
        <h3>{period.title}</h3><p>{period.description}</p><div className="era-card-bottom"><span>{period.dateLabel}</span><ArrowRight size={15} /></div>
      </Link>)}</div>
    </section>

    <section className="home-bottom-grid">
      <div className="continue-card">
        <div className="continue-heading"><div><span className="eyebrow">SEU PERCURSO</span><h2>Continue estudando</h2></div><span className="continue-symbol"><Compass size={21} /></span></div>
        {continueItems.map((item) => <Link key={`${item.type}-${item.id}`} to={item.href} className="continue-item"><span className="continue-marker" /><span><strong>{item.title}</strong><small>{item.type === 'person' ? 'Personagem' : item.type === 'book' ? 'Livro bíblico' : 'Acontecimento'}</small></span><ArrowRight size={16} /></Link>)}
        <Link to="/favoritos" className="continue-footer"><Sparkles size={15} /> Favoritos e anotações ficam guardados neste navegador</Link>
      </div>
      <Link to={`/evento/${featured.slug}`} className="featured-event-card">
        <div className="featured-image"><span className="featured-kicker">EM FOCO · EXÍLIO</span><div className="featured-city"><div className="city-sun"/><div className="city-wall wall-back"/><div className="city-wall wall-front"/><div className="city-tower tower-left"/><div className="city-tower tower-right"/><div className="city-river"/></div><span className="featured-year">587/586 a.C.</span></div>
        <div className="featured-info"><span className="eyebrow">EVENTO EM DESTAQUE</span><h3>{featured.title}</h3><p>{featured.shortDescription}</p><span className="text-link">Ler contexto <ArrowRight size={15} /></span></div>
      </Link>
    </section>
    <div className="home-data-note"><span className="info-mark">i</span><p>As datas antigas podem variar entre cronologias. Cada registro indica quando a data é aproximada ou debatida; use as referências e fontes como ponto de partida para o estudo.</p></div>
    <div className="home-stats"><span><strong>{events.length}</strong> eventos demonstrativos</span><span><strong>{persons.length}</strong> personagens</span><span><strong>{periods.length}</strong> períodos históricos</span><span>Escala: <strong>{formatYear(-1000)} — 100 d.C.</strong></span></div>
  </div>
}
