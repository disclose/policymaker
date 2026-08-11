import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

import { ROUTES } from '../src/config'

const projectRoot = process.cwd()
const distRoot = join(projectRoot, 'dist')
const entryPath = join(distRoot, 'index.html')
const entry = readFileSync(entryPath, 'utf8')

for (const route of ROUTES) {
  if (route === '/') continue
  const routeEntry = join(distRoot, route.slice(1), 'index.html')
  mkdirSync(dirname(routeEntry), { recursive: true })
  writeFileSync(routeEntry, entry)
}

writeFileSync(join(distRoot, '404.html'), entry)
console.log(`Generated ${ROUTES.length} static route entries and 404 fallback.`)
