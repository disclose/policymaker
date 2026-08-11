import fc from 'fast-check'
import { describe, expect, it } from 'vitest'

import {
  isValidDisclosureChannel,
  isValidHostChannel,
  normalizeChannelInput,
} from '@/domain/channels'

describe('channel validation properties', () => {
  it('never accepts an HTTP web contact or policy location', () => {
    fc.assert(
      fc.property(fc.webUrl({ validSchemes: ['http'] }), (url) => {
        const channel = normalizeChannelInput(url)
        expect(isValidDisclosureChannel(channel)).toBe(false)
        expect(isValidHostChannel(channel)).toBe(false)
      }),
      { numRuns: 100 },
    )
  })

  it('accepts syntactically valid HTTPS web contacts and policy locations', () => {
    fc.assert(
      fc.property(fc.webUrl({ validSchemes: ['https'] }), (url) => {
        const channel = normalizeChannelInput(url)
        expect(isValidDisclosureChannel(channel)).toBe(true)
        expect(isValidHostChannel(channel)).toBe(true)
      }),
      { numRuns: 100 },
    )
  })
})
