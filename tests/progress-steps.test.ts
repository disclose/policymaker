import { mount } from '@vue/test-utils'
import { createMemoryHistory } from 'vue-router'
import { describe, expect, it } from 'vitest'

import ProgressSteps from '@/components/ProgressSteps.vue'
import { NAV_STEPS } from '@/config'
import { createPolicymakerRouter } from '@/router'
import { normalizeChannelInput } from '@/domain/channels'
import { usePolicymaker } from '@/state/policymaker'

async function mountAt(path: string) {
  const router = createPolicymakerRouter(createMemoryHistory())
  await router.push(path)
  await router.isReady()
  return mount(ProgressSteps, { global: { plugins: [router] } })
}

describe('progress step indicator', () => {
  // NAV_STEPS[0] is '/', which is a prefix of every path. A startsWith match would pin the
  // indicator to step 1 on every route in the wizard; these cases are what catches that.
  it('marks the landing page as step 1', async () => {
    const wrapper = await mountAt('/')
    expect(wrapper.text()).toContain(`Step 1 of ${NAV_STEPS.length}`)
    expect(wrapper.text()).toContain('Introduction')
  })

  it('marks the organization route as step 2', async () => {
    const wrapper = await mountAt('/policymaker/organization')
    expect(wrapper.text()).toContain(`Step 2 of ${NAV_STEPS.length}`)
    expect(wrapper.text()).toContain('Organization details')
  })

  it('marks the settings route as step 3', async () => {
    const { configuration } = usePolicymaker()
    configuration.organizationName = 'Example Corp'
    configuration.channels[0] = normalizeChannelInput('security@example.com')
    const wrapper = await mountAt('/policymaker/settings')
    expect(wrapper.text()).toContain(`Step 3 of ${NAV_STEPS.length}`)
    expect(wrapper.text()).toContain('Policy settings')
  })

  it('marks every download child route as the final step', async () => {
    const { configuration } = usePolicymaker()
    configuration.organizationName = 'Example Corp'
    configuration.channels[0] = normalizeChannelInput('security@example.com')
    configuration.hostUrl = normalizeChannelInput('https://example.com/security')
    for (const path of [
      '/policymaker/download/vdp',
      '/policymaker/download/securitytxt',
      '/policymaker/download/dnssecuritytxt',
      '/policymaker/download/safe-harbor-clause',
    ]) {
      const wrapper = await mountAt(path)
      expect(wrapper.text()).toContain(`Step ${NAV_STEPS.length} of ${NAV_STEPS.length}`)
    }
  })

  it('points every nav step at a path that resolves without redirecting', async () => {
    const router = createPolicymakerRouter(createMemoryHistory())
    for (const step of NAV_STEPS) {
      expect(router.resolve(step.route).path).toBe(step.route)
    }
  })
})
