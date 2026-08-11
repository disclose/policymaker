import fc from 'fast-check'
import { describe, expect, it } from 'vitest'

import { policySource } from '@/generated/policies'
import { stripProvenance } from '../scripts/lib/dioterms'

describe('policy-source properties', () => {
  it('strips exactly one leading provenance comment from arbitrary bodies', () => {
    fc.assert(
      fc.property(fc.string().map((value) => `#${value}`), (body) => {
        const document = `<!-- provenance ${body.length} -->\n${body}`
        expect(stripProvenance(document)).toBe(body)
      }),
      { numRuns: 100 },
    )
  })

  it('never exposes provenance headers in generated policy bodies', () => {
    for (const localized of Object.values(policySource.policies)) {
      for (const body of Object.values(localized)) {
        expect(body.trimStart().startsWith('<!--')).toBe(false)
      }
    }
  })
})
