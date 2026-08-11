import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { ROUTES } from '../src/config'

const distRoot = join(process.cwd(), 'dist')
const failures: string[] = []

function requireFile(relativePath: string): string {
  const path = join(distRoot, relativePath)
  if (!existsSync(path)) {
    failures.push(`missing dist/${relativePath}`)
    return ''
  }
  return readFileSync(path, 'utf8')
}

for (const route of ROUTES) {
  const relativePath = route === '/' ? 'index.html' : `${route.slice(1)}/index.html`
  requireFile(relativePath)
}

const html = requireFile('index.html')
const requiredHtml = [
  '<meta name="description"',
  '<link rel="canonical"',
  'property="og:title"',
  'name="twitter:card"',
  'type="application/ld+json"',
  'G-LLY1T4DZX7',
]

for (const marker of requiredHtml) {
  if (!html.includes(marker)) failures.push(`index.html missing ${marker}`)
}

for (const file of ['CNAME', 'favicon.ico', 'llms.txt', 'og-card.jpg', 'robots.txt', 'sitemap.xml']) {
  requireFile(file)
}

if (requireFile('CNAME').trim() !== 'policymaker.disclose.io') {
  failures.push('CNAME does not target policymaker.disclose.io')
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`Verified ${ROUTES.length} routes, metadata, CNAME, and public discovery files.`)
