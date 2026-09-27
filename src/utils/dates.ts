import type { DateType, TimelineEntity } from '../types'

/** Uses signed historical years: 1000 a.C. = -1000, 1 d.C. = 1. There is no year zero. */
export function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} a.C.`
  if (year === 0) return '1 a.C. / 1 d.C.'
  return `${year} d.C.`
}

export function dateTypeLabel(type: DateType): string {
  const labels: Record<DateType, string> = {
    exact: 'Data estabelecida',
    approximate: 'Data aproximada',
    disputed: 'Data debatida',
    range: 'Período aproximado',
    unknown: 'Data desconhecida',
  }
  return labels[type]
}

export function compareChronologically<T extends Pick<TimelineEntity, 'startYear' | 'title'>>(a: T, b: T): number {
  return a.startYear - b.startYear || a.title.localeCompare(b.title, 'pt-BR')
}

export function timelinePercent(year: number, minYear: number, maxYear: number): number {
  if (maxYear <= minYear) return 0
  return Math.min(100, Math.max(0, ((year - minYear) / (maxYear - minYear)) * 100))
}

export function yearsOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart <= bEnd && bStart <= aEnd
}
