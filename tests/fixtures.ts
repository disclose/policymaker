import type { PolicyConfiguration } from '@/domain/types'

export function configurationFixture(
  overrides: Partial<PolicyConfiguration> = {},
): PolicyConfiguration {
  return {
    language: 'en-US',
    organizationName: 'Example Corp',
    organizationDomain: 'example.com',
    reportingLanguages: '',
    channels: [
      { type: 'email', prefix: 'mailto:', address: 'security@example.com' },
      { type: 'url', prefix: 'https://', address: 'example.com/report' },
    ],
    cvdTimelineDays: 90,
    hostUrl: { type: 'url', prefix: 'https://', address: 'example.com/security' },
    ...overrides,
  }
}
