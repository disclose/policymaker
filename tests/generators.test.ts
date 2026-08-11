import { describe, expect, it } from 'vitest'

import { normalizeChannelInput } from '@/domain/channels'
import {
  buildBindZone,
  buildDnsRecords,
  dnsVerificationCommand,
  normalizeDomainInput,
} from '@/domain/dns'
import { canonicalPolicy, renderPolicy, renderSafeHarbor, renderVdp, selectVdpFamily } from '@/domain/policies'
import { renderSecurityTxt, securityTxtExpiry } from '@/domain/securityTxt'
import { configurationFixture } from './fixtures'

describe('artifact generators', () => {
  it('self-heals a previously insecure URL prefix when the address is corrected', () => {
    const corrected = normalizeChannelInput('example.com/security', '')
    expect(corrected).toEqual({ type: 'url', prefix: 'https://', address: 'example.com/security' })
  })

  it('renders organization, ordered channels, and CVD window', () => {
    const configuration = configurationFixture()
    const result = renderPolicy(
      '{{organization}} reports via {{channel}} within {{disclosure_window}} days.',
      configuration,
    )

    expect(result).toBe(
      'Example Corp reports via mailto:security@example.com or https://example.com/report within 90 days.',
    )
  })

  it.each([180, 120, 90, 60, 45, 30])('selects the CVD family for %i days', (days) => {
    expect(selectVdpFamily(days)).toBe('vdp-with-cvd')
  })

  it('selects the non-CVD family for zero days', () => {
    expect(selectVdpFamily(0)).toBe('vdp')
    const configuration = configurationFixture({ cvdTimelineDays: 0 })
    expect(renderVdp(configuration)).toBe(renderPolicy(canonicalPolicy('vdp', 'en-US'), configuration))
  })

  it('renders canonical safe-harbor content', () => {
    const configuration = configurationFixture()
    expect(renderSafeHarbor(configuration)).toBe(
      renderPolicy(canonicalPolicy('safe-harbor', 'en-US'), configuration),
    )
  })

  it('renders security.txt contacts, policy, explicit languages, and deterministic expiry', () => {
    const generatedAt = new Date('2024-02-29T12:34:56.789Z')
    const result = renderSecurityTxt(configurationFixture({ reportingLanguages: 'en, fr-FR' }), generatedAt)

    expect(result).toContain('Contact: mailto:security@example.com\nContact: https://example.com/report')
    expect(result).toContain('Policy: https://example.com/security')
    expect(result).toContain('Preferred-Languages: en, fr-FR')
    expect(result).toContain('Expires: 2025-02-27T12:34:56Z')
    expect(securityTxtExpiry(generatedAt)).toBe('2025-02-27T12:34:56Z')
  })

  it('omits Preferred-Languages until reporting languages are explicitly configured', () => {
    expect(renderSecurityTxt(configurationFixture())).not.toContain('Preferred-Languages:')
  })

  it('renders DNS contacts, policy, and exactly one expiry record', () => {
    const records = buildDnsRecords(
      configurationFixture(),
      new Date('2026-01-01T00:00:00Z'),
    )
    expect(records.filter((record) => record.value.includes('security_contact='))).toHaveLength(2)
    expect(records.filter((record) => record.value.includes('security_policy='))).toHaveLength(1)
    expect(records.filter((record) => record.value.includes('security_expires='))).toHaveLength(1)
    expect(records.at(-1)?.value).toBe('"security_expires=2026-12-31T00:00:00Z"')
    expect(records.every((record) => record.name === '_security.example.com')).toBe(true)
  })

  it('normalizes a hostname from domain and URL input', () => {
    expect(normalizeDomainInput('Example.COM.')).toBe('example.com')
    expect(normalizeDomainInput('https://www.example.com/security/policy')).toBe('www.example.com')
    expect(normalizeDomainInput('.')).toBe('')
    expect(normalizeDomainInput('not a domain')).toBe('')
  })

  it('renders copy-ready BIND output and a dig verification command', () => {
    const configuration = configurationFixture()
    const records = buildDnsRecords(configuration, new Date('2026-01-01T00:00:00Z'))
    expect(buildBindZone(records)).toContain('_security.example.com. 3600 IN TXT "security_contact=mailto:security@example.com"')
    expect(dnsVerificationCommand('example.com')).toBe('dig TXT _security.example.com +short')
  })
})
