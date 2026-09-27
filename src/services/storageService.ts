const STORAGE_EVENT = 'cronologia-storage-change'

export const storageService = {
  read<T>(key: string, fallback: T): T {
    try {
      const value = localStorage.getItem(key)
      return value ? (JSON.parse(value) as T) : fallback
    } catch {
      return fallback
    }
  },
  write<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }))
    } catch {
      // The app stays usable when browser storage is disabled or full.
    }
  },
  subscribe(listener: () => void): () => void {
    const handle = () => listener()
    window.addEventListener(STORAGE_EVENT, handle)
    window.addEventListener('storage', handle)
    return () => {
      window.removeEventListener(STORAGE_EVENT, handle)
      window.removeEventListener('storage', handle)
    }
  },
}
