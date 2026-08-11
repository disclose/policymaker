import { describe, expect, it } from 'vitest'
import { strFromU8, unzipSync } from 'fflate'

import { buildPolicyBundleArchive, buildPolicyBundleFiles, downloadPolicyBundle } from '@/domain/bundle'
import { configurationFixture } from './fixtures'

describe('policy deployment bundle', () => {
  it('contains every generated artifact and deployment guidance', () => {
    const files = buildPolicyBundleFiles(
      configurationFixture(),
      new Date('2026-01-01T00:00:00Z'),
      'fixture-id',
    )

    expect(Object.keys(files)).toEqual([
      'disclose-io-vdp.md',
      'disclose-io-vdp.html',
      'disclose-io-safe-harbor.md',
      'disclose-io-safe-harbor.html',
      'security.txt',
      'dns-security.txt',
      'DEPLOYMENT.md',
    ])
    expect(files['security.txt']).toContain('Expires: 2026-12-31T00:00:00Z')
    expect(files['dns-security.txt']).toContain('security_expires=2026-12-31T00:00:00Z')
    expect(files['DEPLOYMENT.md']).toContain('/.well-known/security.txt')
    expect(files['DEPLOYMENT.md']).toContain('dig TXT _security.example.com +short')
  })

  it('creates a readable ZIP whose files preserve their generated bodies', () => {
    const archive = buildPolicyBundleArchive(
      configurationFixture(),
      new Date('2026-01-01T00:00:00Z'),
      'fixture-id',
    )
    const entries = unzipSync(archive)

    expect(Object.keys(entries)).toEqual([
      'disclose-io-vdp.md',
      'disclose-io-vdp.html',
      'disclose-io-safe-harbor.md',
      'disclose-io-safe-harbor.html',
      'security.txt',
      'dns-security.txt',
      'DEPLOYMENT.md',
    ])
    expect(strFromU8(entries['security.txt']!)).not.toContain('Preferred-Languages:')
    expect(strFromU8(entries['DEPLOYMENT.md']!)).toContain('dig TXT _security.example.com +short')
  })

  it('downloads the ZIP through the shared browser-safe download path', () => {
    vi.useFakeTimers()
    const createObjectUrl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:bundle-test')
    const revokeObjectUrl = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)

    downloadPolicyBundle(configurationFixture())

    expect(createObjectUrl).toHaveBeenCalledOnce()
    expect(click).toHaveBeenCalledOnce()
    vi.runAllTimers()
    expect(revokeObjectUrl).toHaveBeenCalledWith('blob:bundle-test')
    vi.useRealTimers()
  })
})
