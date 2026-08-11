import { execFileSync } from 'node:child_process'
import { join } from 'node:path'

const projectRoot = process.cwd()
const sourceRoot = join(projectRoot, 'vendor', 'dioterms')

function run(command: string, args: string[], cwd = projectRoot): string {
  return execFileSync(command, args, { cwd, encoding: 'utf8', stdio: ['inherit', 'pipe', 'inherit'] }).trim()
}

const previousRevision = run('git', ['rev-parse', 'HEAD'], sourceRoot)
run('git', ['fetch', 'origin', 'main'], sourceRoot)
run('git', ['checkout', '--detach', 'FETCH_HEAD'], sourceRoot)
const nextRevision = run('git', ['rev-parse', 'HEAD'], sourceRoot)

console.log(`DIOTerms revision: ${previousRevision} -> ${nextRevision}`)
run('bun', ['run', 'policies:generate'])
run('bun', ['run', 'verify'])
console.log('DIOTerms update passed semantic, source-fidelity, build, and workflow verification.')
