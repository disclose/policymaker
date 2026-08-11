import type { SupportedLocale } from '@/generated/policies'

export type ChannelType = '' | 'email' | 'url'

export type Channel = {
  type: ChannelType
  prefix: string
  address: string
}

export type PolicyConfiguration = {
  language: SupportedLocale
  organizationName: string
  organizationDomain: string
  reportingLanguages: string
  channels: Channel[]
  cvdTimelineDays: number
  hostUrl: Channel
}

export type DownloadDescriptor = {
  type: 'text/plain' | 'text/markdown' | 'text/html'
  label: string
  filename: string
  eventLabel: 'text' | 'markdown' | 'html'
}

export type DnsRecord = {
  name: string
  type: 'TXT'
  value: string
}
