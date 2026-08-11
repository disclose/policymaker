import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const projectRoot = process.cwd()
const documentation = [
  'README.md',
  'CONTRIBUTING.md',
  'docs/ARCHITECTURE.md',
  'docs/DEPLOYMENT.md',
  'public/llms.txt',
]

describe('maintainer documentation', () => {
  it('keeps every local Markdown link resolvable', () => {
    for (const relativePath of documentation.filter((path) => path.endsWith('.md'))) {
      const source = readFileSync(join(projectRoot, relativePath), 'utf8')
      const links = [...source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)].map((match) => match[1])

      for (const link of links) {
        if (/^(?:https?:|mailto:|#)/.test(link)) continue
        const target = link.split('#')[0]
        expect(existsSync(resolve(projectRoot, dirname(relativePath), target)), `${relativePath}: ${link}`).toBe(true)
      }
    }
  })

  it('documents the canonical-source, update, verification, and deployment contracts', () => {
    const combined = documentation
      .map((path) => readFileSync(join(projectRoot, path), 'utf8'))
      .join('\n')

    for (const required of [
      'vendor/dioterms',
      'semantic availability',
      'bun run policies:update',
      'bun run verify',
      'GitHub Pages',
      'browser',
    ]) {
      expect(combined).toContain(required)
    }
  })

  it('contains no stale legacy setup commands', () => {
    const combined = documentation
      .map((path) => readFileSync(join(projectRoot, path), 'utf8'))
      .join('\n')

    expect(combined).not.toMatch(/npm install|npx |yarn |sync-templates|localhost:3000/)
  })
})
