import { createMemoryHistory } from 'vue-router'
import { describe, expect, it } from 'vitest'

import { normalizeChannelInput } from '@/domain/channels'
import { createPolicymakerRouter } from '@/router'
import { usePolicymaker } from '@/state/policymaker'

describe('route guards', () => {
  it('redirects incomplete settings navigation to the first input step', async () => {
    const router = createPolicymakerRouter(createMemoryHistory())
    await router.push('/policymaker/settings')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/policymaker/organization')
  })

  it('redirects incomplete download navigation to the first input step', async () => {
    const router = createPolicymakerRouter(createMemoryHistory())
    await router.push('/policymaker/download/vdp')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/policymaker/organization')
  })

  it('allows completed configuration through the ten-route wizard', async () => {
    const { configuration } = usePolicymaker()
    configuration.organizationName = 'Example Corp'
    configuration.channels[0] = normalizeChannelInput('security@example.com')
    configuration.hostUrl = normalizeChannelInput('https://example.com/security')
    const router = createPolicymakerRouter(createMemoryHistory())

    await router.push('/policymaker/download')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/policymaker/download/vdp')
  })
})

describe('legacy introduction paths', () => {
  it('redirects /policymaker to the landing page', async () => {
    const router = createPolicymakerRouter(createMemoryHistory())
    await router.push('/policymaker')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('redirects /policymaker/introduction to the landing page', async () => {
    const router = createPolicymakerRouter(createMemoryHistory())
    await router.push('/policymaker/introduction')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/')
  })

  // The production host 301s bare paths to their trailing-slash form, so the trailing-slash
  // variant is the one the router actually receives for these URLs in the wild.
  for (const path of ['/policymaker/', '/policymaker/introduction/']) {
    it(`redirects the trailing-slash form ${path} to the landing page`, async () => {
      const router = createPolicymakerRouter(createMemoryHistory())
      await router.push(path)
      await router.isReady()
      expect(router.currentRoute.value.matched.length).toBeGreaterThan(0)
      expect(router.currentRoute.value.path).toBe('/')
    })
  }
})
