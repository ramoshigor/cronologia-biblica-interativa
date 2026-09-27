import { describe, expect, it } from 'vitest'
import { compareChronologically, dateTypeLabel, formatYear, timelinePercent, yearsOverlap } from './dates'

describe('historical date helpers', () => {
  it('formats signed historical years without introducing year zero', () => {
    expect(formatYear(-586)).toBe('586 a.C.')
    expect(formatYear(1)).toBe('1 d.C.')
  })

  it('sorts BCE events in historical order', () => {
    const ordered = [{ startYear: -586, title: 'Jerusalém' }, { startYear: -1000, title: 'Davi' }, { startYear: 30, title: 'Pentecostes' }].sort(compareChronologically)
    expect(ordered.map((item) => item.startYear)).toEqual([-1000, -586, 30])
  })

  it('clamps a year to its timeline range', () => {
    expect(timelinePercent(-2000, -1000, 100)).toBe(0)
    expect(timelinePercent(100, -1000, 100)).toBe(100)
    expect(timelinePercent(-450, -1000, 100)).toBe(50)
  })

  it('identifies overlapping periods and labels debated dates', () => {
    expect(yearsOverlap(-600, -500, -586, -539)).toBe(true)
    expect(yearsOverlap(-900, -800, -600, -500)).toBe(false)
    expect(dateTypeLabel('disputed')).toBe('Data debatida')
  })
})
