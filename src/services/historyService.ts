import { storageService } from './storageService'

const KEY = 'cronologia:recent:v1'
export interface RecentItem { type: 'event' | 'person' | 'book'; id: string; slug: string; title: string; href: string; viewedAt: number }

export const historyService = {
  list(): RecentItem[] { return storageService.read<RecentItem[]>(KEY, []) },
  record(item: Omit<RecentItem, 'viewedAt'>): void {
    const next = [{ ...item, viewedAt: Date.now() }, ...this.list().filter((entry) => !(entry.type === item.type && entry.id === item.id))]
    storageService.write(KEY, next.slice(0, 6))
  },
}
