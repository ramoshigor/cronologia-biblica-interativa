import { yearsOverlap } from './dates'

export interface DatedItem {
  startYear: number
  endYear?: number
}

export function filterByDateWindow<T extends DatedItem>(items: T[], minYear: number, maxYear: number): T[] {
  return items.filter((item) => yearsOverlap(item.startYear, item.endYear ?? item.startYear, minYear, maxYear))
}

export function filterByPeriod<T extends { periodId: string }>(items: T[], periodId?: string): T[] {
  return periodId ? items.filter((item) => item.periodId === periodId) : items
}
