import fc from 'fast-check'
import { describe, expect, it } from 'vitest'

import { buildDnsRecords } from '@/domain/dns'
import { renderPolicy } from '@/domain/policies'
import { renderSecurityTxt } from '@/domain/securityTxt'
import type { Channel } from '@/domain/types'
import { configurationFixture } from './fixtures'

const organizationArbitrary = fc.string().map((value) => value.replaceAll('{', ''))
const channelArbitrary = fc.record({
  type: fc.constant<'email'>('email'),
  prefix: fc.constant('mailto:'),
  address: fc.emailAddress(),
})

describe('generator properties', () => {
  it('removes every organization and disclosure-window placeholder', () => {
    fc.assert(
      fc.property(organizationArbitrary, fc.integer({ min: 0, max: 365 }), (organization, days) => {
        const configuration = configurationFixture({ organizationName: organization, cvdTimelineDays: days })
        const rendered = renderPolicy(
          '{{organization}} / {{organization}} / {{disclosure_window}}',
          configuration,
        )
        expect(rendered).not.toContain('{{organization}}')
        expect(rendered).not.toContain('{{disclosure_window}}')
      }),
      { numRuns: 100 },
    )
  })

  it('maps each channel to exactly one security.txt and DNS contact record', () => {
    fc.assert(
      fc.property(fc.array(channelArbitrary, { minLength: 1, maxLength: 8 }), (channels) => {
        const configuration = configurationFixture({ channels: channels as Channel[] })
        const securityTxt = renderSecurityTxt(configuration, new Date('2026-01-01T00:00:00Z'))
        const dnsRecords = buildDnsRecords(configuration)
        expect(securityTxt.match(/^Contact:/gm)).toHaveLength(channels.length)
        expect(dnsRecords.filter((record) => record.value.includes('security_contact='))).toHaveLength(channels.length)
        expect(dnsRecords.filter((record) => record.value.includes('security_expires='))).toHaveLength(1)
        expect(dnsRecords.every((record) => record.name === '_security.example.com')).toBe(true)
      }),
      { numRuns: 100 },
    )
  })
})
