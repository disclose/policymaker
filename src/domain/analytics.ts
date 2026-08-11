import type { PolicyConfiguration } from './types'

export type AnalyticsParameters = Record<string, boolean | number | string>

export type TrackedArtifact = 'deployment_bundle' | 'dns' | 'safe-harbor' | 'security.txt' | 'vdp'

export function trackEvent(name: string, parameters: AnalyticsParameters): void {
  window.gtag?.('event', name, parameters)
}

/**
 * Stable, non-identifying id for one policy configuration.
 *
 * Derived only from the answers the user typed, so the same configuration always produces the
 * same id and a re-download or a page refresh does not read as a second policy. It is emitted as
 * a parameter on creation, download and copy events, which is what lets a funnel be reconstructed
 * without any cross-page state — the app deliberately keeps nothing in storage.
 *
 * FNV-1a over the canonical field order. Not a security primitive; it exists to group events.
 */
export function policyId(configuration: PolicyConfiguration): string {
  // organizationDomain is deliberately excluded. DnsRecordsTable derives it from the policy URL
  // on mount when it is empty, so including it made the id change the moment a user opened the
  // DNS tab — the same policy reported two ids and the join key was worthless. It is a
  // per-record DNS detail, not part of what identifies the policy.
  const canonical = JSON.stringify([
    configuration.organizationName.trim().toLowerCase(),
    configuration.channels.map((channel) => `${channel.prefix}${channel.address}`.toLowerCase()),
    `${configuration.hostUrl.prefix}${configuration.hostUrl.address}`.toLowerCase(),
    configuration.cvdTimelineDays,
    configuration.language,
    configuration.reportingLanguages.trim().toLowerCase(),
  ])

  let hash = 0x811c9dc5
  for (let index = 0; index < canonical.length; index++) {
    hash ^= canonical.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash.toString(36).padStart(7, '0')
}

/**
 * `wizard_introduction` is retained for GA continuity only. The standalone introduction step was
 * merged into the landing page on 2026-08-11 and no longer emits this entry point; the member
 * stays so existing funnel reports keyed on the literal do not read as a traffic collapse.
 * @deprecated since 2026-08-11 — no call site emits `wizard_introduction`.
 */
export function trackStart(entryPoint: 'landing_page' | 'wizard_introduction'): void {
  trackEvent('policymaker_start', { entry_point: entryPoint })
}

export function trackWizardStep(step: 'download' | 'organization' | 'settings'): void {
  trackEvent('wizard_step', { step })
}

const generatedPolicies = new Set<string>()

/**
 * Fires once per distinct configuration.
 *
 * This used to fire on DownloadView mount, which counted arrivals at a route rather than policies
 * produced — back-navigation, a refresh, and a deep link with an empty store each minted a
 * phantom "creation". Guarding on the configuration hash means the count tracks distinct policies.
 */
export function trackPolicyGenerated(configuration: PolicyConfiguration): void {
  const id = policyId(configuration)
  if (generatedPolicies.has(id)) return
  generatedPolicies.add(id)

  trackEvent('policy_generated', {
    artifact: 'vulnerability_disclosure_policy',
    cvd_enabled: configuration.cvdTimelineDays > 0,
    cvd_days: configuration.cvdTimelineDays,
    channel_count: configuration.channels.length,
    locale: configuration.language,
    policy_id: id,
  })
}

/** Test seam — the guard above is module state and would leak between test cases. */
export function resetGeneratedPolicies(): void {
  generatedPolicies.clear()
}

export function trackSecurityTxtGenerated(variant: 'dns_record' | 'rfc9116_file'): void {
  trackEvent('security_txt_generated', { variant })
}

export function trackDownload(
  artifact: TrackedArtifact,
  format: 'html' | 'markdown' | 'text' | 'zip',
  options: { locale?: string; policyId?: string } = {},
): void {
  const categoryEvent = `${artifact}_download`.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 40)
  const eventLabel = options.locale ? `${options.locale}_${format}` : format
  trackEvent(categoryEvent, {
    event_category: artifact,
    event_label: eventLabel,
    artifact,
    format,
    ...(options.policyId && { policy_id: options.policyId }),
  })
  trackEvent('artifact_download', {
    artifact,
    format,
    ...(options.locale && { locale: options.locale }),
    ...(options.policyId && { policy_id: options.policyId }),
  })
}

/**
 * Copy is a first-class delivery method here, not a nicety: DNS records are meant to be pasted
 * into a zone file, so a user can complete the whole job without ever downloading anything.
 *
 * Call this from the resolved clipboard promise, never from the click handler — `writeText`
 * rejects on non-secure contexts and on some permission and user-gesture paths, and firing on
 * click would count those failures as successes.
 */
export function trackCopy(
  target: 'dns_record' | 'dns_zone' | 'verification_command',
  outcome: 'failed' | 'ok',
  options: { policyId?: string } = {},
): void {
  trackEvent(outcome === 'ok' ? 'artifact_copied' : 'copy_failed', {
    artifact: 'dns',
    copy_target: target,
    ...(options.policyId && { policy_id: options.policyId }),
  })
}

export function trackBundleDownload(policyIdValue?: string): void {
  trackDownload('deployment_bundle', 'zip', { policyId: policyIdValue })
}
