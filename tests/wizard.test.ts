import { mount } from '@vue/test-utils'
import { createMemoryHistory } from 'vue-router'
import { describe, expect, it } from 'vitest'

import ChannelList from '@/components/ChannelList.vue'
import PolicyPreview from '@/components/PolicyPreview.vue'
import { VDP_DOWNLOADS } from '@/config'
import { createPolicymakerRouter } from '@/router'
import { usePolicymaker } from '@/state/policymaker'
import OrganizationView from '@/views/OrganizationView.vue'
import SettingsView from '@/views/SettingsView.vue'
import VdpView from '@/views/VdpView.vue'

async function routerPlugin() {
  const router = createPolicymakerRouter(createMemoryHistory())
  await router.push('/policymaker/organization')
  await router.isReady()
  return router
}

describe('wizard interactions', () => {
  it('adds and removes non-primary channels', async () => {
    const wrapper = mount(ChannelList)
    expect(wrapper.findAll('input')).toHaveLength(1)

    await wrapper.findAll('button').find((button) => button.text() === 'Add another')!.trigger('click')
    expect(wrapper.findAll('input')).toHaveLength(2)

    await wrapper.get('button[aria-label="Remove disclosure channel"]').trigger('click')
    expect(wrapper.findAll('input')).toHaveLength(1)
  })

  it('requires every added disclosure channel to be standards-valid', async () => {
    const wrapper = mount(OrganizationView, { global: { plugins: [await routerPlugin()] } })
    const next = wrapper.findAll('button').find((button) => button.text() === 'Next')!
    await wrapper.get('input#organization-name').setValue('Example Corp')
    await wrapper.get('input#disclosure-channel-1').setValue('security@example.com')
    expect(next.attributes('disabled')).toBeUndefined()

    await wrapper.findAll('button').find((button) => button.text() === 'Add another')!.trigger('click')
    expect(next.attributes('disabled')).toBeDefined()
    await wrapper.get('input#disclosure-channel-2').setValue('http://reports.example.com')
    expect(next.attributes('disabled')).toBeDefined()
    await wrapper.get('input#disclosure-channel-2').setValue('reports.example.com/form')
    expect(next.attributes('disabled')).toBeUndefined()
  })

  it('gates organization navigation on name and primary channel', async () => {
    const wrapper = mount(OrganizationView, { global: { plugins: [await routerPlugin()] } })
    const next = wrapper.findAll('button').find((button) => button.text() === 'Next')!
    expect(wrapper.find('label[for="organization-name"]').exists()).toBe(true)
    expect(wrapper.find('input#organization-name').exists()).toBe(true)
    expect(next.attributes('disabled')).toBeDefined()

    await wrapper.get('input[placeholder="Organization name"]').setValue('Example Corp')
    expect(next.attributes('disabled')).toBeDefined()

    await wrapper.get('input[placeholder="Email address or webform url"]').setValue('security@example.com')
    expect(next.attributes('disabled')).toBeUndefined()

    const channel = wrapper.get('input#disclosure-channel-1')
    expect(channel.attributes('aria-labelledby')).toContain('disclosure-channels-label')
  })

  it('gates download navigation on policy URL', async () => {
    const { configuration } = usePolicymaker()
    configuration.organizationName = 'Example Corp'
    configuration.channels[0] = { type: 'email', prefix: 'mailto:', address: 'security@example.com' }
    const wrapper = mount(SettingsView, { global: { plugins: [await routerPlugin()] } })
    const next = wrapper.get('button:not(.button--muted)')
    expect(next.attributes('disabled')).toBeDefined()

    await wrapper.get('input[placeholder="website.com/contact-us"]').setValue('example.com/security')
    expect(next.attributes('disabled')).toBeUndefined()

    await wrapper.get('input[placeholder="website.com/contact-us"]').setValue('http://example.com/security')
    expect(next.attributes('disabled')).toBeDefined()
    expect(wrapper.get('input#policy-url').attributes('aria-invalid')).toBe('true')
    expect(wrapper.text()).toContain('HTTPS')

    await wrapper.get('input#policy-url').setValue('example.com/security')
    expect(next.attributes('disabled')).toBeUndefined()
  })

  it('offers only semantically available locales for the active policy family', async () => {
    const { configuration } = usePolicymaker()
    configuration.organizationName = 'Example Corp'
    configuration.channels[0] = { type: 'email', prefix: 'mailto:', address: 'security@example.com' }
    configuration.cvdTimelineDays = 90
    const wrapper = mount(VdpView)

    expect(wrapper.findAll('select option').map((option) => option.attributes('value')))
      .toEqual(['en-US'])

    configuration.cvdTimelineDays = 0
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('select option').map((option) => option.attributes('value')))
      .toContain('ar')
    expect(wrapper.text()).toContain('DIOTerms revision')
    expect(wrapper.text()).not.toContain('Version 2021.1')
  })

  it('associates every visible audited prompt and presents Back before Next', async () => {
    const organization = mount(OrganizationView, { global: { plugins: [await routerPlugin()] } })
    expect(organization.find('#disclosure-channels-label').exists()).toBe(true)
    expect(organization.find('#disclosure-channel-1').exists()).toBe(true)
    expect(organization.findAll('.action-bar button').map((button) => button.text())).toEqual(['Back', 'Next'])

    const settings = mount(SettingsView, { global: { plugins: [await routerPlugin()] } })
    expect(settings.find('label[for="policy-url"]').exists()).toBe(true)
    expect(settings.find('label[for="reporting-languages"]').exists()).toBe(true)
    expect(settings.findAll('.action-bar button').map((button) => button.text())).toEqual(['Back', 'Next'])
  })
})
