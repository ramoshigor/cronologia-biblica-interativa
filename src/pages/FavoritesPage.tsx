import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Bookmark, Download, Heart, Trash2, Upload } from 'lucide-react'
import { Breadcrumbs, SectionHeading } from '../components/Shared'
import { books, empires, events, persons, places } from '../repositories/catalogRepository'
import { favoritesService } from '../services/favoritesService'
import { storageService } from '../services/storageService'
import { parseStudyBackup, studyBackupService } from '../services/studyBackupService'
import type { StudyBackup } from '../services/studyBackupService'
import type { Favorite, SearchResult } from '../types'

function getFavorite(favorite: Favorite): SearchResult | undefined {
  if (favorite.type === 'event') { const item = events.find((entry) => entry.id === favorite.id); return item && { type: 'event', id: item.id, slug: item.slug, title: item.title, subtitle: item.dateLabel, href: `/evento/${item.slug}` } }
  if (favorite.type === 'person') { const item = persons.find((entry) => entry.id === favorite.id); return item && { type: 'person', id: item.id, slug: item.slug, title: item.title, subtitle: `${item.role} · ${item.dateLabel}`, href: `/personagem/${item.slug}` } }
  if (favorite.type === 'book') { const item = books.find((entry) => entry.id === favorite.id); return item && { type: 'book', id: item.id, slug: item.slug, title: item.title, subtitle: item.category, href: `/livro/${item.slug}` } }
  if (favorite.type === 'place') { const item = places.find((entry) => entry.id === favorite.id); return item && { type: 'place', id: item.id, slug: item.slug, title: item.title, subtitle: 'Lugar bíblico', href: `/lugar/${item.slug}` } }
  const empire = empires.find((item) => item.id === favorite.id)
  return empire && { type: 'empire', id: empire.id, slug: empire.id, title: empire.title, subtitle: empire.dateLabel, href: `/linha-do-tempo?imp=${empire.id}` }
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(() => favoritesService.list())
  const [pendingBackup, setPendingBackup] = useState<StudyBackup | null>(null)
  const [backupMessage, setBackupMessage] = useState('')
  useEffect(() => storageService.subscribe(() => setFavorites(favoritesService.list())), [])
  const entries = favorites.map((favorite) => ({ favorite, item: getFavorite(favorite) })).filter((entry) => entry.item !== undefined)
  const downloadBackup = () => {
    const blob = new Blob([JSON.stringify(studyBackupService.export(), null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `cronologia-biblica-estudo-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    setBackupMessage('Cópia de segurança criada.')
  }
  const readBackup = async (file?: File) => {
    setPendingBackup(null)
    if (!file) return
    try {
      if (file.size > 1_000_000) throw new Error('O arquivo excede o limite de 1 MB.')
      const backup = parseStudyBackup(await file.text())
      setPendingBackup(backup)
      setBackupMessage('Confira o conteúdo antes de substituir os dados deste navegador.')
    } catch (error) { setBackupMessage(error instanceof Error ? error.message : 'Não foi possível ler o arquivo.') }
  }
  return <div className="favorites-page"><Breadcrumbs items={[{ label: 'Início', href: '/' }, { label: 'Meu estudo' }]} /><div className="page-title-row"><div><span className="eyebrow">SUA BIBLIOTECA PESSOAL</span><h1>Meu estudo</h1><p>Itens salvos e anotações mantidos localmente neste navegador.</p></div><span className="favorites-title-icon"><Bookmark size={22} /></span></div>
    <div className="study-summary-grid"><div><span className="study-summary-icon"><Heart size={17} /></span><strong>{entries.length}</strong><small>Favoritos</small></div><div><span className="study-summary-icon note-summary"><Bookmark size={17} /></span><strong>{favorites.length}</strong><small>Itens no estudo</small></div><div className="study-summary-message"><span className="eyebrow">SEU ESPAÇO DE ESTUDO</span><p>Salve pessoas, eventos, livros e lugares durante a navegação para encontrá-los aqui depois.</p></div></div>
    <section className="favorites-section"><SectionHeading eyebrow="ITENS SALVOS" title="Favoritos" description={entries.length ? `${entries.length} itens salvos neste dispositivo.` : 'Você ainda não salvou nenhum item.'} />{entries.length ? <div className="favorite-grid">{entries.map(({ favorite, item }) => item && <article key={`${favorite.type}-${favorite.id}`} className="favorite-item-card"><Link to={item.href} className="favorite-item-main"><span className={`favorite-type-icon type-${favorite.type}`}>{favorite.type === 'event' ? '✦' : favorite.type === 'person' ? '◉' : favorite.type === 'book' ? '▤' : '⌖'}</span><span><strong>{item.title}</strong><small>{item.subtitle}</small></span><ArrowRight size={16} /></Link><button className="remove-favorite" aria-label={`Remover ${item.title} dos favoritos`} onClick={() => { favoritesService.toggle(favorite.type, favorite.id); setFavorites(favoritesService.list()) }}><Trash2 size={15} /></button></article>)}</div> : <div className="favorites-empty"><span><Heart size={23} /></span><h3>Seu estudo começa com um favorito</h3><p>Abra um evento ou personagem e clique em “Salvar”.</p><Link to="/explorar" className="button button-dark">Explorar conteúdo <ArrowRight size={15} /></Link></div>}</section>
    <section className="study-backup"><div><span className="eyebrow">SEUS DADOS</span><h2>Cópia de segurança</h2><p>Leve favoritos, anotações e visões salvas da cronologia para outro navegador. O arquivo fica com você.</p></div><div className="study-backup-actions"><button className="button button-dark" onClick={downloadBackup}><Download size={16} /> Exportar estudo</button><label className="button button-outline"><Upload size={16} /> Escolher arquivo<input type="file" accept=".json,application/json" onChange={(event) => { void readBackup(event.target.files?.[0]); event.target.value = '' }} /></label></div>
      {pendingBackup && <div className="backup-preview"><strong>Pronto para restaurar</strong><p>{pendingBackup.favorites.length} favoritos · {pendingBackup.notes.length} anotações · {pendingBackup.presets.length} visões salvas. A restauração substitui esses dados neste navegador.</p><div><button className="button button-dark" onClick={() => { studyBackupService.restore(pendingBackup); setPendingBackup(null); setBackupMessage('Estudo restaurado neste navegador.') }}>Restaurar agora</button><button className="button button-outline" onClick={() => { setPendingBackup(null); setBackupMessage('Restauração cancelada.') }}>Cancelar</button></div></div>}
      {backupMessage && <p className="backup-message" role="status">{backupMessage}</p>}</section>
    <div className="local-storage-note"><span className="note-lock">⌂</span><span><strong>Seus dados ficam neste dispositivo.</strong><small>Favoritos e notas são armazenados no navegador. Exporte uma cópia para transferir ou guardar seu estudo.</small></span></div>
  </div>
}
