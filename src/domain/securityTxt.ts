import { channelUris } from './channels'
import { normalizeReportingLanguages } from './languages'
import type { PolicyConfiguration } from './types'

export function securityTxtExpiry(generatedAt = new Date()): string {
  const expiry = new Date(generatedAt.getTime() + 364 * 24 * 60 * 60 * 1000)
  expiry.setUTCMilliseconds(0)
  return expiry.toISOString().replace('.000Z', 'Z')
}

export function renderSecurityTxt(
  configuration: PolicyConfiguration,
  generatedAt = new Date(),
): string {
  const contacts = channelUris(configuration.channels)
    .map((channel) => `Contact: ${channel}`)
  const reportingLanguages = configuration.reportingLanguages.trim()
    ? normalizeReportingLanguages(configuration.reportingLanguages)
    : ''
  const lines = [
    `# ${configuration.organizationName} security contacts and policy`,
    '',
    '# Our security contact channels',
    ...contacts,
    '',
    '# Link to our vulnerability disclosure policy',
    `Policy: ${channelUris([configuration.hostUrl]).join('')}`,
  ]

  if (reportingLanguages) {
    lines.push('', '# Languages accepted by our security response team', `Preferred-Languages: ${reportingLanguages}`)
  }

  lines.push('', '# Expiration date for this security.txt file', `Expires: ${securityTxtExpiry(generatedAt)}`, '')
  return lines.join('\n')
}
