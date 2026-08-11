import { createMemoryHistory } from 'vue-router'
import { describe, expect, it } from 'vitest'

import { normalizeChannelInput } from '@/domain/channels'
import { createPolicymakerRouter } from '@/router'
import { usePolicymaker } from '@/state/policymaker'

describe('route guards', () => {
  it('redirects incomplete settings navigation to introduction', async () => {
    const router = createPolicymakerRouter(createMemoryHistory())
    await router.push('/policymaker/settings')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/policymaker/introduction')
  })

  it('redirects incomplete download navigation to introduction', async () => {
    const router = createPolicymakerRouter(createMemoryHistory())
    await router.push('/policymaker/download/vdp')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/policymaker/introduction')
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
