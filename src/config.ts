import type { DownloadDescriptor } from '@/domain/types'

export const ROUTES = [
  '/',
  '/policymaker',
  '/policymaker/introduction',
  '/policymaker/organization',
  '/policymaker/settings',
  '/policymaker/download',
  '/policymaker/download/vdp',
  '/policymaker/download/securitytxt',
  '/policymaker/download/dnssecuritytxt',
  '/policymaker/download/safe-harbor-clause',
] as const

export const NAV_STEPS = [
  { route: '/', name: 'Introduction' },
  { route: '/policymaker/organization', name: 'Organization details' },
  { route: '/policymaker/settings', name: 'Policy settings' },
  { route: '/policymaker/download', name: 'Download' },
] as const

export const DOWNLOAD_SECTIONS = [
  { route: '/policymaker/download/vdp', name: 'Vulnerability Disclosure Policy' },
  { route: '/policymaker/download/securitytxt', name: 'Security.txt' },
  { route: '/policymaker/download/dnssecuritytxt', name: 'DNS Security.txt' },
] as const

export const CVD_TIMELINE_OPTIONS = [
  { value: 180, label: '180 days (6 months)' },
  { value: 120, label: '120 days (4 months)' },
  { value: 90, label: '90 days (3 months)' },
  { value: 60, label: '60 days (2 months)' },
  { value: 45, label: '45 days (1.5 months)' },
  { value: 30, label: '30 days (1 month)' },
  { value: 0, label: 'Opt-out of CVD Timeline' },
] as const

export const VDP_DOWNLOADS: DownloadDescriptor[] = [
  { type: 'text/markdown', label: 'Save as markdown', filename: 'disclose-io-vdp.md', eventLabel: 'markdown' },
  { type: 'text/html', label: 'Save as HTML', filename: 'disclose-io-vdp.html', eventLabel: 'html' },
]

export const SAFE_HARBOR_DOWNLOADS: DownloadDescriptor[] = [
  { type: 'text/markdown', label: 'Save as markdown', filename: 'disclose-io-safe-harbor.md', eventLabel: 'markdown' },
  { type: 'text/html', label: 'Save as HTML', filename: 'disclose-io-safe-harbor.html', eventLabel: 'html' },
]

export const SECURITY_TXT_DOWNLOADS: DownloadDescriptor[] = [
  { type: 'text/plain', label: 'Download', filename: 'security.txt', eventLabel: 'text' },
]

export const LANGUAGE_LABELS: Record<string, string> = {
  'en-US': 'English',
  ar: 'Arabic',
  'ne-NP': 'Nepali',
}
