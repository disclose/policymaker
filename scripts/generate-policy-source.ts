import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

import { loadPolicySource, serializePolicyModule } from './lib/dioterms'

const projectRoot = process.cwd()
const outputPath = join(projectRoot, 'src', 'generated', 'policies.ts')
const expected = serializePolicyModule(loadPolicySource(projectRoot))
const current = existsSync(outputPath) ? readFileSync(outputPath, 'utf8') : null
const checkOnly = Bun.argv.includes('--check')

if (checkOnly) {
  const legacyTemplateRoot = join(projectRoot, 'static', 'templates')
  if (existsSync(legacyTemplateRoot)) {
    console.error('Legacy static/templates still duplicates canonical policy sources.')
    process.exit(1)
  }

  if (current !== expected) {
    console.error('Generated policy source is missing or stale. Run `bun run policies:generate`.')
    process.exit(1)
  }

  console.log('Policy source matches the pinned DIOTerms revision.')
  process.exit(0)
}

if (current === expected) {
  console.log('Policy source is current.')
  process.exit(0)
}

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, expected)
console.log(`Generated ${outputPath}`)
