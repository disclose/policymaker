import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import dnsSecurityTxt from '@/content/dnssecuritytxt.md?raw'
import introduction from '@/content/introduction.md?raw'
import securityTxt from '@/content/securitytxt.md?raw'

describe('guidance content', () => {
  const downloadView = readFileSync(join(process.cwd(), 'src/views/DownloadView.vue'), 'utf8')
  const landingView = readFileSync(join(process.cwd(), 'src/views/LandingView.vue'), 'utf8')
  it('retains all introduction sections', () => {
    for (const heading of ['Who is this for?', 'How does it work?', "What's next?", 'What will I require?', 'Ready to start?']) {
      expect(introduction).toContain(heading)
    }
  })

  it('retains security.txt and DNS guidance', () => {
    expect(securityTxt).toContain('## Security.txt')
    expect(securityTxt).toContain('RFC9116')
    expect(securityTxt).toContain('HTTPS')
    expect(securityTxt).toContain('text/plain')
    expect(securityTxt).toContain('UTF-8')
    expect(securityTxt).not.toContain('root directory')
    expect(dnsSecurityTxt).toContain('## DNS Security.txt')
    expect(dnsSecurityTxt).toContain('_security.<domain>')
    expect(dnsSecurityTxt).toContain('normative')
    expect(dnsSecurityTxt).not.toContain('apex')
  })

  it('describes the four-step workflow without stale product language', () => {
    expect(introduction).toContain('four steps')
    expect(introduction).not.toContain('1-2-3')
    expect(landingView).not.toContain('renderMarkdown(introduction)')
  })

  it('surfaces standards-aware deployment guidance in the workflow', () => {
    for (const step of ['Publish the policy', '/.well-known/security.txt', '_security.&lt;domain&gt;', 'renew them before their expiry']) {
      expect(downloadView).toContain(step)
    }
    expect(downloadView).toContain('Download all (.zip)')
  })
})
