import { execFileSync } from 'node:child_process'
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
  })

  // Replaces the inverse assertion from fe56cf8, which required the landing page NOT to render
  // the introduction. The standalone introduction route was merged into the landing page on
  // 2026-08-11; this asserts the current intent so the split is not silently reintroduced.
  it('renders the introduction prose on the landing page', () => {
    expect(landingView).toContain("import introduction from '@/content/introduction.md?raw'")
    expect(landingView).toContain('renderMarkdown(introduction)')
  })

  it('renders the introduction prose from exactly one component', () => {
    const componentsDir = join(process.cwd(), 'src')
    const importers = execFileSync(
      'grep',
      ['-rl', "content/introduction.md?raw", componentsDir],
      { encoding: 'utf8' },
    )
      .trim()
      .split('\n')
      .filter(Boolean)
    expect(importers).toHaveLength(1)
    expect(importers[0]).toContain('LandingView.vue')
  })

  it('surfaces standards-aware deployment guidance in the workflow', () => {
    for (const step of ['Publish the policy', '/.well-known/security.txt', '_security.&lt;domain&gt;', 'renew them before their expiry']) {
      expect(downloadView).toContain(step)
    }
    expect(downloadView).toContain('Download all (.zip)')
  })
})

describe('landing call-to-action', () => {
  const landingView = readFileSync(join(process.cwd(), 'src/views/LandingView.vue'), 'utf8')
  const introduction = readFileSync(join(process.cwd(), 'src/content/introduction.md'), 'utf8')

  // The prose closes with: Ready to start? Hit "Begin" and let's get going!
  // If the button label and that sentence drift apart the page contradicts itself.
  it('labels the button with the word the prose tells the reader to look for', () => {
    const quoted = introduction.match(/Hit "([^"]+)"/)?.[1]
    expect(quoted).toBeTruthy()
    expect(landingView).toContain(`<AppButton @click="begin">${quoted}</AppButton>`)
  })

  it('offers exactly one call to action on the landing page', () => {
    expect(landingView.match(/<AppButton/g) ?? []).toHaveLength(1)
  })
})
