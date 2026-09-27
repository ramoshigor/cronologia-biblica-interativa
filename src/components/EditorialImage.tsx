import { useState } from 'react'
import type { EditorialImage as ImageRecord } from '../media/manifest'

export function EditorialImage({ image, className = '', eager = false }: { image: ImageRecord; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false)
  const base = `${import.meta.env.BASE_URL}media/v2/${image.file}`
  if (failed) return <div className={`editorial-image-fallback ${className}`} role="img" aria-label={image.alt} />
  return <picture className={`editorial-picture ${className}`}>
    <source media="(max-width: 800px)" srcSet={`${base}-sm.webp`} />
    <img src={`${base}.webp`} width={image.width} height={image.height} alt={image.alt} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" onError={() => setFailed(true)} />
  </picture>
}
