import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { policySource } from '@/generated/policies'
import { availablePolicyLocales, isPolicyVariantAvailable } from '@/domain/policies'
import { POLICY_FAMILIES, loadPolicySource, stripProvenance } from '../scripts/lib/dioterms'

describe('DIOTerms policy source', () => {
  it('derives locales from the canonical manifest', () => {
    const manifest = JSON.parse(
      readFileSync(join(process.cwd(), 'vendor/dioterms/terms/languages.json'), 'utf8'),
    ) as { languages: string[] }

    expect(policySource.locales).toEqual(manifest.languages)
  })

  it('byte-matches all canonical family and locale bodies after provenance stripping', () => {
    const source = loadPolicySource()

    expect(source.revision).toBe(policySource.revision)
    expect(source.policies).toEqual(policySource.policies)
    expect(Object.keys(source.policies)).toEqual(POLICY_FAMILIES)

    for (const family of POLICY_FAMILIES) {
      for (const locale of source.locales) {
        const canonical = readFileSync(
          join(process.cwd(), 'vendor/dioterms/terms', family, `${locale}.md`),
          'utf8',
        )
        expect(policySource.policies[family][locale as keyof (typeof policySource.policies)[typeof family]])
          .toBe(stripProvenance(canonical))
      }
    }
  })

  it('withholds semantically incomplete or duplicate locale/family combinations', () => {
    expect(isPolicyVariantAvailable('vdp', 'ne-NP')).toBe(false)
    expect(isPolicyVariantAvailable('vdp-with-cvd', 'ar')).toBe(false)
    expect(isPolicyVariantAvailable('vdp-with-cvd', 'ne-NP')).toBe(false)
    expect(isPolicyVariantAvailable('safe-harbor', 'ne-NP')).toBe(false)
    expect(availablePolicyLocales('vdp-with-cvd')).toEqual(['en-US'])
    expect(availablePolicyLocales('vdp')).toContain('ar')
  })
})
