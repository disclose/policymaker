import { describe, expect, it } from 'vitest'

import { CVD_TIMELINE_OPTIONS, ROUTES } from '@/config'

describe('compatibility configuration', () => {
  it('preserves all timeline values and labels', () => {
    expect(CVD_TIMELINE_OPTIONS).toEqual([
      { value: 180, label: '180 days (6 months)' },
      { value: 120, label: '120 days (4 months)' },
      { value: 90, label: '90 days (3 months)' },
      { value: 60, label: '60 days (2 months)' },
      { value: 45, label: '45 days (1.5 months)' },
      { value: 30, label: '30 days (1 month)' },
      { value: 0, label: 'Opt-out of CVD Timeline' },
    ])
  })

  it('preserves the ten-route inventory', () => {
    expect(ROUTES).toHaveLength(10)
    expect(new Set(ROUTES).size).toBe(10)
  })
})
