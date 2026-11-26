import { beforeEach, describe, expect, it, vi } from 'vitest'

import { resetPendingPostHogEvents, trackStart, trackWizardStep } from '@/domain/analytics'

beforeEach(() => resetPendingPostHogEvents())

describe('PostHog delivery', () => {
  it('sends the same event and parameters to GA4 and PostHog', () => {
    const gtag = vi.fn()
    window.gtag = gtag
    const capture = vi.fn()
    window.posthog = { __loaded: true, capture }

    trackWizardStep('settings')

    expect(gtag).toHaveBeenCalledWith('event', 'wizard_step', { step: 'settings' })
    expect(capture).toHaveBeenCalledWith('wizard_step', { step: 'settings' })
  })

  it('holds events fired before posthog-js loads and flushes them on posthog:ready', () => {
    trackStart('landing_page')

    const capture = vi.fn()
    window.posthog = { __loaded: true, capture }
    window.dispatchEvent(new Event('posthog:ready'))
    window.dispatchEvent(new Event('posthog:ready'))

    expect(capture).toHaveBeenCalledTimes(1)
    expect(capture).toHaveBeenCalledWith('policymaker_start', { entry_point: 'landing_page' })
  })

  it('caps the queue when PostHog never loads (blocked)', () => {
    for (let index = 0; index < 80; index++) trackWizardStep('organization')

    const capture = vi.fn()
    window.posthog = { __loaded: true, capture }
    window.dispatchEvent(new Event('posthog:ready'))

    expect(capture).toHaveBeenCalledTimes(50)
  })
})
