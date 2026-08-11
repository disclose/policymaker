import fc from 'fast-check'
import { describe, expect, it } from 'vitest'

import { stampArtifact } from '@/domain/downloads'

describe('download stamp properties', () => {
  it('uses format-appropriate comments without changing the body', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.constantFrom<'text/html' | 'text/markdown' | 'text/plain'>('text/html', 'text/markdown', 'text/plain'),
        (body, type) => {
          const stamped = stampArtifact(body, type, {
            generatedAt: new Date('2026-08-11T00:00:00Z'),
            id: 'fixture-id',
          })
          expect(stamped.startsWith(body.replace(/\s+$/, ''))).toBe(true)
          if (type === 'text/plain') {
            expect(stamped).toContain('\n# Generated with policymaker.disclose.io (dioterms) | 2026-08-11 | id:fixture-id\n')
          } else {
            expect(stamped).toContain('\n<!-- Generated with policymaker.disclose.io (dioterms) | 2026-08-11 | id:fixture-id -->\n')
          }
        },
      ),
      { numRuns: 100 },
    )
  })
})
