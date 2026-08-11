import { channelUris } from './channels'
import { securityTxtExpiry } from './securityTxt'
import type { DnsRecord, PolicyConfiguration } from './types'

const DOMAIN_LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i

export function normalizeDomainInput(value: string): string {
  const input = value.trim()
  if (!input || /\s/.test(input)) return ''

  try {
    const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(input) ? input : `https://${input}`
    const url = new URL(candidate)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return ''
    const hostname = url.hostname.toLowerCase().replace(/\.$/, '')
    if (!hostname.includes('.') || hostname.length > 253) return ''
    if (!hostname.split('.').every((label) => DOMAIN_LABEL.test(label))) return ''
    return hostname
  } catch {
    return ''
  }
}

export function domainFromPolicyUrl(configuration: PolicyConfiguration): string {
  return normalizeDomainInput(channelUris([configuration.hostUrl])[0] ?? '')
}

export function effectiveDnsDomain(configuration: PolicyConfiguration): string {
  return normalizeDomainInput(configuration.organizationDomain)
    || domainFromPolicyUrl(configuration)
    || 'domain.com'
}

export function dnsRecordName(domain: string): string {
  return `_security.${normalizeDomainInput(domain) || 'domain.com'}`
}

export function buildDnsRecords(
  configuration: PolicyConfiguration,
  generatedAt = new Date(),
): DnsRecord[] {
  const name = dnsRecordName(effectiveDnsDomain(configuration))
  const contacts = channelUris(configuration.channels).map((channel) => ({
    name,
    type: 'TXT' as const,
    value: `"security_contact=${channel}"`,
  }))
  const policyUrl = channelUris([configuration.hostUrl])[0]

  return [
    ...contacts,
    ...(policyUrl
      ? [{ name, type: 'TXT' as const, value: `"security_policy=${policyUrl}"` }]
      : []),
    { name, type: 'TXT' as const, value: `"security_expires=${securityTxtExpiry(generatedAt)}"` },
  ]
}

export function buildBindZone(records: DnsRecord[]): string {
  return `${records.map((record) => `${record.name}. 3600 IN ${record.type} ${record.value}`).join('\n')}\n`
}

export function dnsVerificationCommand(domain: string): string {
  return `dig TXT ${dnsRecordName(domain)} +short`
}
