export type AnalyticsParameters = Record<string, boolean | number | string>

export function trackEvent(name: string, parameters: AnalyticsParameters): void {
  window.gtag?.('event', name, parameters)
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

export function trackPolicyGenerated(cvdEnabled: boolean): void {
  trackEvent('policy_generated', {
    artifact: 'vulnerability_disclosure_policy',
    cvd_enabled: cvdEnabled,
  })
}

export function trackSecurityTxtGenerated(variant: 'dns_record' | 'rfc9116_file'): void {
  trackEvent('security_txt_generated', { variant })
}

export function trackDownload(
  artifact: 'safe-harbor' | 'security.txt' | 'vdp',
  format: 'html' | 'markdown' | 'text',
  locale?: string,
): void {
  const categoryEvent = `${artifact}_download`.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 40)
  const eventLabel = locale ? `${locale}_${format}` : format
  trackEvent(categoryEvent, {
    event_category: artifact,
    event_label: eventLabel,
    artifact,
    format,
  })
  trackEvent('artifact_download', { artifact, format })
}

export function trackBundleDownload(): void {
  trackEvent('artifact_download', { artifact: 'deployment_bundle', format: 'zip' })
}
