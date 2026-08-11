import type { Channel } from './types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_PREFIX_PATTERN = /^https?:\/\//i
const URLISH_PATTERN = /^[^@/\s]+\.[^@\s]+(?:\/.*)?$/

export function createEmptyChannel(): Channel {
  return { type: '', prefix: '', address: '' }
}

export function createHostChannel(): Channel {
  return { type: 'url', prefix: 'https://', address: '' }
}

export function channelUri(channel: Channel): string {
  return `${channel.prefix.trim()}${channel.address.trim()}`
}

export function channelUris(channels: Channel[]): string[] {
  return channels.map(channelUri)
}

export function isEmailAddress(value: string): boolean {
  return EMAIL_PATTERN.test(value.replace(/^mailto:/i, '').trim())
}

export function isValidHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && Boolean(url.hostname)
  } catch {
    return false
  }
}

export function normalizeChannelInput(value: string, previousPrefix = ''): Channel {
  const compact = value.replace(/\s/g, '')

  const protocol = compact.match(URL_PREFIX_PATTERN)?.[0]
  if (protocol) {
    return {
      type: 'url',
      prefix: protocol.toLowerCase(),
      address: compact.replace(URL_PREFIX_PATTERN, ''),
    }
  }

  if (isEmailAddress(compact)) {
    return {
      type: 'email',
      prefix: 'mailto:',
      address: compact.replace(/^mailto:/i, ''),
    }
  }

  if (previousPrefix.match(URL_PREFIX_PATTERN) || compact.includes('/') || URLISH_PATTERN.test(compact)) {
    return {
      type: 'url',
      prefix: previousPrefix.match(URL_PREFIX_PATTERN)?.[0]?.toLowerCase() ?? 'https://',
      address: compact,
    }
  }

  return {
    type: '',
    prefix: '',
    address: compact,
  }
}

export function isValidDisclosureChannel(channel: Channel): boolean {
  if (!channel.address.trim()) return false
  return channel.type === 'email'
    ? isEmailAddress(channel.address)
    : channel.type === 'url' && isValidHttpsUrl(channelUri(channel))
}

export function isValidHostChannel(channel: Channel): boolean {
  return channel.type === 'url' && isValidHttpsUrl(channelUri(channel))
}

export function disclosureChannelError(channel: Channel): string {
  if (!channel.address.trim()) return 'Enter an email address or HTTPS reporting form.'
  if (channel.type === 'email') {
    return isEmailAddress(channel.address) ? '' : 'Enter a complete email address.'
  }
  if (channelUri(channel).toLowerCase().startsWith('http://')) {
    return 'Use an HTTPS reporting form URL; HTTP is not valid for security.txt.'
  }
  return isValidDisclosureChannel(channel) ? '' : 'Enter a complete email address or HTTPS URL.'
}

export function hostChannelError(channel: Channel): string {
  if (!channel.address.trim()) return 'Enter the HTTPS address where the policy will be published.'
  if (channelUri(channel).toLowerCase().startsWith('http://')) {
    return 'Use an HTTPS policy URL as required by RFC 9116.'
  }
  return isValidHostChannel(channel) ? '' : 'Enter a complete HTTPS policy URL.'
}
