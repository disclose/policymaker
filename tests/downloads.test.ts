import { describe, expect, it } from 'vitest'

import { SAFE_HARBOR_DOWNLOADS, SECURITY_TXT_DOWNLOADS, VDP_DOWNLOADS } from '@/config'
import { downloadArtifact } from '@/domain/downloads'

describe('download descriptors', () => {
  it('preserves artifact filenames', () => {
    expect([...VDP_DOWNLOADS, ...SAFE_HARBOR_DOWNLOADS, ...SECURITY_TXT_DOWNLOADS].map((item) => item.filename))
      .toEqual([
        'disclose-io-vdp.md',
        'disclose-io-vdp.html',
        'disclose-io-safe-harbor.md',
        'disclose-io-safe-harbor.html',
        'security.txt',
      ])
  })

  it('preserves artifact MIME types', () => {
    expect([...VDP_DOWNLOADS, ...SAFE_HARBOR_DOWNLOADS, ...SECURITY_TXT_DOWNLOADS].map((item) => item.type))
      .toEqual(['text/markdown', 'text/html', 'text/markdown', 'text/html', 'text/plain'])
  })

  it('downloads a stamped artifact with the configured filename', () => {
    vi.useFakeTimers()
    window.gtag = vi.fn()
    const createObjectUrl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:policymaker-test')
    const revokeObjectUrl = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)

    downloadArtifact('# Policy', VDP_DOWNLOADS[0], { artifact: 'vdp', format: 'markdown' })

    expect(createObjectUrl).toHaveBeenCalledOnce()
    expect(click).toHaveBeenCalledOnce()
    vi.runAllTimers()
    expect(revokeObjectUrl).toHaveBeenCalledWith('blob:policymaker-test')
    vi.useRealTimers()
  })
})
