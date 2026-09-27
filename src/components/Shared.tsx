import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Bookmark, Check, ChevronRight, Clock3, Heart, LoaderCircle, StickyNote, Trash2 } from 'lucide-react'
import { dateTypeLabel } from '../utils/dates'
import { favoritesService } from '../services/favoritesService'
import { notesService } from '../services/notesService'
import { storageService } from '../services/storageService'
import type { BiblicalReference, DateType, EntityType, StudyNote } from '../types'

export function LoadingPage() {
  return <div className="loading-state"><LoaderCircle className="spin" size={24} /><span>Carregando estudo...</span></div>
}

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  return <nav className="breadcrumbs" aria-label="Trilha de navegação">{items.map((item, index) => <span key={`${item.label}-${index}`} className="breadcrumb-item">{index > 0 && <ChevronRight size={14} />}{item.href ? <Link to={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</span>)}</nav>
}

export function DateBadge({ label, type }: { label: string; type: DateType }) {
  return <span className={`date-badge date-${type}`} aria-label={`${label}. ${dateTypeLabel(type)}`} title={dateTypeLabel(type)}><Clock3 size={13} aria-hidden="true" />{label}<span className="date-certainty" aria-hidden="true">{dateTypeLabel(type)}</span></span>
}

export function FavoriteButton({ type, id, label }: { type: EntityType; id: string; label?: string }) {
  const [saved, setSaved] = useState(() => favoritesService.has(type, id))
  useEffect(() => storageService.subscribe(() => setSaved(favoritesService.has(type, id))), [id, type])
  return <button className={`favorite-button ${saved ? 'saved' : ''}`} aria-pressed={saved} aria-label={saved ? `Remover ${label ?? 'item'} dos favoritos` : `Salvar ${label ?? 'item'} nos favoritos`} onClick={() => { favoritesService.toggle(type, id); setSaved(favoritesService.has(type, id)) }}><Heart size={17} fill={saved ? 'currentColor' : 'none'} />{label && <span>{saved ? 'Salvo' : 'Salvar'}</span>}</button>
}

export function ReferencePills({ references }: { references: BiblicalReference[] }) {
  if (!references.length) return <span className="muted">Sem referência cadastrada</span>
  return <div className="reference-list">{references.map((reference) => <span className="reference-pill" key={`${reference.book}-${reference.chapter}-${reference.verseStart ?? 0}`}>{reference.label}</span>)}</div>
}

export function NotePanel({ type, entityId }: { type: EntityType; entityId: string }) {
  const [text, setText] = useState('')
  const [notes, setNotes] = useState<StudyNote[]>(() => notesService.forEntity(type, entityId))
  const [justSaved, setJustSaved] = useState(false)
  useEffect(() => storageService.subscribe(() => setNotes(notesService.forEntity(type, entityId))), [type, entityId])
  const save = () => {
    if (!text.trim()) return
    notesService.save(type, entityId, text.trim())
    setText('')
    setJustSaved(true)
    window.setTimeout(() => setJustSaved(false), 1800)
    setNotes(notesService.forEntity(type, entityId))
  }
  return <section className="note-panel"><div className="section-heading compact"><span className="section-icon"><StickyNote size={17} /></span><div><h3>Minhas anotações</h3><p>Notas salvas somente neste navegador.</p></div></div><label className="sr-only" htmlFor={`note-${entityId}`}>Nova anotação</label><textarea id={`note-${entityId}`} value={text} onChange={(event) => setText(event.target.value)} placeholder="Escreva uma observação para seu estudo..." rows={3} /><div className="note-actions"><span className="muted">{justSaved ? <><Check size={14} /> Anotação salva</> : 'Privada neste dispositivo'}</span><button className="button button-small button-dark" disabled={!text.trim()} onClick={save}><Bookmark size={14} /> Salvar nota</button></div>{notes.length > 0 && <div className="saved-notes">{notes.map((note) => <article key={note.id} className="saved-note"><p>{note.text}</p><button aria-label="Excluir nota" onClick={() => { notesService.remove(note.id); setNotes(notesService.forEntity(type, entityId)) }}><Trash2 size={14} /></button></article>)}</div>}</section>
}

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="section-heading-row"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>
}

export function EntityLink({ href, icon, title, meta }: { href: string; icon?: React.ReactNode; title: string; meta?: string }) {
  return <Link to={href} className="entity-link-card">{icon && <span className="entity-link-icon">{icon}</span>}<span><strong>{title}</strong>{meta && <small>{meta}</small>}</span><ChevronRight size={16} className="entity-link-chevron" /></Link>
}
