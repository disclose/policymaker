import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('GitHub Pages workflow', () => {
  const workflow = readFileSync(join(process.cwd(), '.github/workflows/deploy.yml'), 'utf8')
  const dependabot = readFileSync(join(process.cwd(), '.github/dependabot.yml'), 'utf8')
  const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8')) as {
    scripts: Record<string, string>
    packageManager: string
    engines: { bun: string }
  }

  it('checks out DIOTerms and verifies with Bun', () => {
    expect(workflow).toContain('submodules: recursive')
    expect(workflow).toContain('oven-sh/setup-bun@v2')
    expect(workflow).toContain('bun install --frozen-lockfile')
    expect(workflow).toContain('bun run verify')
    expect(packageJson.packageManager).toBe('bun@1.3.6')
    expect(packageJson.engines.bun).toBe('>=1.3.6 <2')
  })

  it('automates reviewed DIOTerms revision proposals and verification', () => {
    expect(dependabot).toContain('package-ecosystem: gitsubmodule')
    expect(packageJson.scripts['policies:update']).toBe('bun scripts/update-dioterms.ts')
    const updater = readFileSync(join(process.cwd(), 'scripts/update-dioterms.ts'), 'utf8')
    expect(updater).toContain('execFileSync')
    expect(updater).toContain("['fetch', 'origin', 'main']")
    expect(updater).toContain("['run', 'verify']")
  })

  it('deploys only successful pushes to main', () => {
    expect(workflow).toContain("if: github.event_name == 'push' && github.ref == 'refs/heads/main'")
    expect(workflow).toContain('branch: gh-pages')
    expect(workflow).toContain('folder: dist')
    expect(workflow).toContain('contents: write')
    expect(workflow).toContain('group: policymaker-pages')
    expect(workflow).toContain('cancel-in-progress: true')
  })
})
