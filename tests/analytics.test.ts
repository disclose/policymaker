import { describe, expect, it, vi } from 'vitest'

import { trackDownload, trackPolicyGenerated, trackSecurityTxtGenerated, trackStart } from '@/domain/analytics'

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

    trackPolicyGenerated(true)
    trackSecurityTxtGenerated('rfc9116_file')
    trackSecurityTxtGenerated('dns_record')

    expect(gtag).toHaveBeenNthCalledWith(1, 'event', 'policy_generated', {
      artifact: 'vulnerability_disclosure_policy',
      cvd_enabled: true,
    })
    expect(gtag).toHaveBeenNthCalledWith(2, 'event', 'security_txt_generated', { variant: 'rfc9116_file' })
    expect(gtag).toHaveBeenNthCalledWith(3, 'event', 'security_txt_generated', { variant: 'dns_record' })
  })

  it('emits category and aggregate download contracts', () => {
    const gtag = vi.fn()
    window.gtag = gtag

    trackDownload('security.txt', 'text', 'en-US')

    expect(gtag).toHaveBeenNthCalledWith(1, 'event', 'security_txt_download', {
      event_category: 'security.txt',
      event_label: 'en-US_text',
      artifact: 'security.txt',
      format: 'text',
    })
    expect(gtag).toHaveBeenNthCalledWith(2, 'event', 'artifact_download', {
      artifact: 'security.txt',
      format: 'text',
    })
  })
})
