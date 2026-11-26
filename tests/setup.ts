import { afterEach, vi } from 'vitest'

import { resetConfiguration } from '@/state/policymaker'

afterEach(() => {
  resetConfiguration()
  window.dataLayer = []
  window.gtag = vi.fn()
  delete window.posthog
  vi.restoreAllMocks()
})
