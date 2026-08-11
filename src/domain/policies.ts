import { policySource } from '@/generated/policies'

import { channelUris } from './channels'
import type { PolicyConfiguration } from './types'

export type CanonicalFamily = keyof typeof policySource.policies
export type CanonicalLocale = keyof (typeof policySource.policies)['vdp']

const REQUIRED_TOKENS: Record<CanonicalFamily, readonly string[]> = {
  vdp: ['{{organization}}', '{{channel}}'],
  'vdp-with-cvd': ['{{organization}}', '{{channel}}', '{{disclosure_window}}'],
  'safe-harbor': [],
  'simple-safe-harbor': [],
}

function replaceToken(source: string, token: string, value: string): string {
  return source.replaceAll(token, () => value)
}

export function canonicalPolicy(family: CanonicalFamily, locale: CanonicalLocale): string {
  return policySource.policies[family][locale]
}

export function isPolicyVariantAvailable(
  family: CanonicalFamily,
  locale: CanonicalLocale,
): boolean {
  const body = canonicalPolicy(family, locale)
  if (!REQUIRED_TOKENS[family].every((token) => body.includes(token))) return false

  return !Object.entries(policySource.policies).some(([otherFamily, localized]) =>
    otherFamily !== family && localized[locale] === body,
  )
}

export function availablePolicyLocales(family: CanonicalFamily): CanonicalLocale[] {
  return policySource.locales.filter((locale) =>
    isPolicyVariantAvailable(family, locale as CanonicalLocale),
  ) as CanonicalLocale[]
}

export function availableLocale(
  family: CanonicalFamily,
  preferred: CanonicalLocale,
): CanonicalLocale {
  const locales = availablePolicyLocales(family)
  if (locales.includes(preferred)) return preferred
  const fallback = locales[0]
  if (!fallback) throw new Error(`DIOTerms has no semantically complete ${family} policy.`)
  return fallback
}

export function selectVdpFamily(cvdTimelineDays: number): 'vdp' | 'vdp-with-cvd' {
  return cvdTimelineDays > 0 ? 'vdp-with-cvd' : 'vdp'
}

export function renderPolicy(source: string, configuration: PolicyConfiguration): string {
  const substitutions = [
    ['{{organization}}', configuration.organizationName],
    ['{{channel}}', channelUris(configuration.channels).join(' or ')],
    ['{{disclosure_window}}', String(configuration.cvdTimelineDays)],
  ] as const

  return substitutions.reduce(
    (policy, [token, value]) => replaceToken(policy, token, value),
    source,
  )
}

export function renderVdp(configuration: PolicyConfiguration): string {
  const family = selectVdpFamily(configuration.cvdTimelineDays)
  return renderPolicy(canonicalPolicy(family, configuration.language), configuration)
}

export function renderSafeHarbor(configuration: PolicyConfiguration): string {
  return renderPolicy(canonicalPolicy('safe-harbor', configuration.language), configuration)
}
