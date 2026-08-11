import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  policyId,
  resetGeneratedPolicies,
  trackCopy,
  trackDownload,
  trackPolicyGenerated,
  trackSecurityTxtGenerated,
  trackStart,
  trackWizardStep,
} from '@/domain/analytics'
import type { PolicyConfiguration } from '@/domain/types'

function makeConfiguration(overrides: Partial<PolicyConfiguration> = {}): PolicyConfiguration {
  return {
    language: 'en-US',
    organizationName: 'Example Corp',
    organizationDomain: 'example.com',
    reportingLanguages: '',
    channels: [{ type: 'email', prefix: 'mailto:', address: 'security@example.com' }],
    cvdTimelineDays: 90,
    hostUrl: { type: 'url', prefix: 'https://', address: 'example.com/security' },
    ...overrides,
  }
}

beforeEach(() => resetGeneratedPolicies())

describe('analytics compatibility', () => {
  it('emits both start event contracts', () => {
    const gtag = vi.fn()
    window.gtag = gtag

    trackStart('landing_page')
    trackStart('wizard_introduction')

    expect(gtag).toHaveBeenNthCalledWith(1, 'event', 'policymaker_start', { entry_point: 'landing_page' })
    expect(gtag).toHaveBeenNthCalledWith(2, 'event', 'policymaker_start', { entry_point: 'wizard_introduction' })
  })

  it('emits policy and security generation contracts', () => {
    const gtag = vi.fn()
    window.gtag = gtag
    const configuration = makeConfiguration()

    trackPolicyGenerated(configuration)
    trackSecurityTxtGenerated('rfc9116_file')
    trackSecurityTxtGenerated('dns_record')

    expect(gtag).toHaveBeenNthCalledWith(1, 'event', 'policy_generated', {
      artifact: 'vulnerability_disclosure_policy',
      cvd_enabled: true,
      cvd_days: 90,
      channel_count: 1,
      locale: 'en-US',
      policy_id: policyId(configuration),
    })
    expect(gtag).toHaveBeenNthCalledWith(2, 'event', 'security_txt_generated', { variant: 'rfc9116_file' })
    expect(gtag).toHaveBeenNthCalledWith(3, 'event', 'security_txt_generated', { variant: 'dns_record' })
  })

  it('emits category and aggregate download contracts', () => {
    const gtag = vi.fn()
    window.gtag = gtag

    trackDownload('security.txt', 'text', { locale: 'en-US' })

    expect(gtag).toHaveBeenNthCalledWith(1, 'event', 'security_txt_download', {
      event_category: 'security.txt',
      event_label: 'en-US_text',
      artifact: 'security.txt',
      format: 'text',
    })
    expect(gtag).toHaveBeenNthCalledWith(2, 'event', 'artifact_download', {
      artifact: 'security.txt',
      format: 'text',
      locale: 'en-US',
    })
  })

  it('emits a download contract for DNS records', () => {
    const gtag = vi.fn()
    window.gtag = gtag

    trackDownload('dns', 'text', { policyId: 'abc123' })

    expect(gtag).toHaveBeenNthCalledWith(1, 'event', 'dns_download', expect.objectContaining({
      artifact: 'dns',
      format: 'text',
      policy_id: 'abc123',
    }))
    expect(gtag).toHaveBeenNthCalledWith(2, 'event', 'artifact_download', expect.objectContaining({
      artifact: 'dns',
      format: 'text',
    }))
  })

  it('separates successful copies from clipboard failures', () => {
    const gtag = vi.fn()
    window.gtag = gtag

    trackCopy('dns_zone', 'ok')
    trackCopy('verification_command', 'failed')

    expect(gtag).toHaveBeenNthCalledWith(1, 'event', 'artifact_copied', {
      artifact: 'dns',
      copy_target: 'dns_zone',
    })
    expect(gtag).toHaveBeenNthCalledWith(2, 'event', 'copy_failed', {
      artifact: 'dns',
      copy_target: 'verification_command',
    })
  })

  it('emits one wizard_step event per named step', () => {
    const gtag = vi.fn()
    window.gtag = gtag

    trackWizardStep('organization')
    trackWizardStep('settings')
    trackWizardStep('download')

    expect(gtag).toHaveBeenNthCalledWith(1, 'event', 'wizard_step', { step: 'organization' })
    expect(gtag).toHaveBeenNthCalledWith(2, 'event', 'wizard_step', { step: 'settings' })
    expect(gtag).toHaveBeenNthCalledWith(3, 'event', 'wizard_step', { step: 'download' })
  })
})

describe('policy identity', () => {
  it('is stable for the same configuration', () => {
    expect(policyId(makeConfiguration())).toBe(policyId(makeConfiguration()))
  })

  it('changes when a meaningful answer changes', () => {
    expect(policyId(makeConfiguration())).not.toBe(
      policyId(makeConfiguration({ organizationName: 'Other Corp' })),
    )
    expect(policyId(makeConfiguration())).not.toBe(
      policyId(makeConfiguration({ cvdTimelineDays: 0 })),
    )
  })

  it('ignores casing and surrounding whitespace', () => {
    expect(policyId(makeConfiguration())).toBe(
      policyId(makeConfiguration({ organizationName: '  EXAMPLE CORP  ' })),
    )
  })
})

describe('creation counting', () => {
  // The old implementation fired on DownloadView mount, so a refresh or a back-navigation
  // minted a second "creation" for the same policy. These are the cases that caught that.
  it('counts one creation per distinct configuration however many times it is reported', () => {
    const gtag = vi.fn()
    window.gtag = gtag
    const configuration = makeConfiguration()

    trackPolicyGenerated(configuration)
    trackPolicyGenerated(configuration)
    trackPolicyGenerated(makeConfiguration())

    expect(gtag.mock.calls.filter(([, name]) => name === 'policy_generated')).toHaveLength(1)
  })

  it('counts a genuinely different policy separately', () => {
    const gtag = vi.fn()
    window.gtag = gtag

    trackPolicyGenerated(makeConfiguration())
    trackPolicyGenerated(makeConfiguration({ organizationName: 'Second Corp' }))

    expect(gtag.mock.calls.filter(([, name]) => name === 'policy_generated')).toHaveLength(2)
  })
})

describe('policy identity stability across the wizard', () => {
  // Caught by a real browser run, not by these tests: opening the DNS tab makes
  // DnsRecordsTable derive organizationDomain from the policy URL, which mutates the
  // configuration. When that field fed the hash, one policy reported two different ids and
  // creation could not be joined to its downloads.
  it('does not change when organizationDomain is derived mid-session', () => {
    const before = makeConfiguration({ organizationDomain: '' })
    const after = makeConfiguration({ organizationDomain: 'example.com' })
    expect(policyId(before)).toBe(policyId(after))
  })

  it('still distinguishes policies that differ in an answer the user actually gave', () => {
    expect(policyId(makeConfiguration({ organizationDomain: '' })))
      .not.toBe(policyId(makeConfiguration({ organizationDomain: '', reportingLanguages: 'en, fr' })))
  })
})
