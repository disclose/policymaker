import { strToU8, zipSync } from 'fflate'

import { renderMarkdown } from '@/markdown'

import { buildBindZone, buildDnsRecords, dnsVerificationCommand, effectiveDnsDomain } from './dns'
import { downloadBlob, stampArtifact } from './downloads'
import { availableLocale, renderPolicy, canonicalPolicy, selectVdpFamily } from './policies'
import { renderSecurityTxt } from './securityTxt'
import type { PolicyConfiguration } from './types'

export type PolicyBundleFiles = Record<string, string>

function configurationFor(
  configuration: PolicyConfiguration,
  family: 'safe-harbor' | 'vdp' | 'vdp-with-cvd',
): PolicyConfiguration {
  return {
    ...configuration,
    language: availableLocale(family, configuration.language),
  }
}

export function buildDeploymentGuide(
  configuration: PolicyConfiguration,
  generatedAt = new Date(),
): string {
  const domain = effectiveDnsDomain(configuration)
  const policyUrl = `${configuration.hostUrl.prefix}${configuration.hostUrl.address}`
  const securityTxtUrl = `https://${domain}/.well-known/security.txt`
  const expiry = buildDnsRecords(configuration, generatedAt)
    .find((record) => record.value.includes('security_expires='))
    ?.value.replace(/^"security_expires=|"$/g, '')

  return `# Policymaker deployment checklist

1. Publish the vulnerability disclosure policy at ${policyUrl} over HTTPS.
2. Serve \`security.txt\` at ${securityTxtUrl} with \`Content-Type: text/plain; charset=utf-8\`.
3. Add every row in \`dns-security.txt\` to the authoritative DNS zone for ${domain}.
4. Verify the DNS records with \`${dnsVerificationCommand(domain)}\`.
5. Confirm the policy and security.txt URLs from a private browser window.
6. Review and renew the discovery records before ${expiry ?? 'their expiry timestamp'}.

Generated policy language comes from pinned DIOTerms revision. Review the final policy with appropriate legal and security stakeholders before publication.
`
}

export function buildPolicyBundleFiles(
  configuration: PolicyConfiguration,
  generatedAt = new Date(),
  lineageId?: string,
): PolicyBundleFiles {
  const vdpFamily = selectVdpFamily(configuration.cvdTimelineDays)
  const vdpConfiguration = configurationFor(configuration, vdpFamily)
  const safeHarborConfiguration = configurationFor(configuration, 'safe-harbor')
  const vdp = renderPolicy(canonicalPolicy(vdpFamily, vdpConfiguration.language), vdpConfiguration)
  const safeHarbor = renderPolicy(
    canonicalPolicy('safe-harbor', safeHarborConfiguration.language),
    safeHarborConfiguration,
  )
  const securityTxt = renderSecurityTxt(configuration, generatedAt)
  const dns = buildBindZone(buildDnsRecords(configuration, generatedAt))
  const guide = buildDeploymentGuide(configuration, generatedAt)
  const options = { generatedAt, id: lineageId }

  return {
    'disclose-io-vdp.md': stampArtifact(vdp, 'text/markdown', options),
    'disclose-io-vdp.html': stampArtifact(renderMarkdown(vdp), 'text/html', options),
    'disclose-io-safe-harbor.md': stampArtifact(safeHarbor, 'text/markdown', options),
    'disclose-io-safe-harbor.html': stampArtifact(renderMarkdown(safeHarbor), 'text/html', options),
    'security.txt': stampArtifact(securityTxt, 'text/plain', options),
    'dns-security.txt': stampArtifact(dns, 'text/plain', options),
    'DEPLOYMENT.md': stampArtifact(guide, 'text/markdown', options),
  }
}

export function buildPolicyBundleArchive(
  configuration: PolicyConfiguration,
  generatedAt = new Date(),
  lineageId?: string,
): Uint8Array {
  const files = buildPolicyBundleFiles(configuration, generatedAt, lineageId)
  return zipSync(
    Object.fromEntries(Object.entries(files).map(([name, content]) => [name, strToU8(content)])),
    { level: 6 },
  )
}

export function downloadPolicyBundle(configuration: PolicyConfiguration): void {
  const zip = buildPolicyBundleArchive(configuration)
  downloadBlob(
    new Blob([Uint8Array.from(zip)], { type: 'application/zip' }),
    'policymaker-deployment-bundle.zip',
  )
}
