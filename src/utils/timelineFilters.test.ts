import { describe, expect, it } from 'vitest'
import { filterByDateWindow, filterByPeriod } from './timelineFilters'

describe('timeline filters', () => {
  const sample = [
    { id: 'patriarchs', periodId: 'patriarchs', startYear: -2000 },
    { id: 'exile', periodId: 'exile', startYear: -600, endYear: -539 },
    { id: 'church', periodId: 'church', startYear: 30, endYear: 49 },
  ]

  it('filters events by a selected period', () => {
    expect(filterByPeriod(sample, 'exile').map((item) => item.id)).toEqual(['exile'])
    expect(filterByPeriod(sample).length).toBe(3)
  })

  it('keeps items that overlap the selected date window', () => {
    expect(filterByDateWindow(sample, -586, -539).map((item) => item.id)).toEqual(['exile'])
    expect(filterByDateWindow(sample, -2050, -1950).map((item) => item.id)).toEqual(['patriarchs'])
  })
})
