import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const projectRoot = process.cwd()
const failures: string[] = []

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name)
    return statSync(path).isDirectory() ? sourceFiles(path) : [path]
  })
}

for (const path of sourceFiles(join(projectRoot, 'src'))) {
  if (!/\.(ts|vue)$/.test(path)) continue
  const source = readFileSync(path, 'utf8')
  for (const pattern of ['localStorage', 'sessionStorage', 'indexedDB']) {
    if (source.includes(pattern)) failures.push(`${pattern} persistence found in ${path}`)
  }
  if (/\bfetch\s*\(/.test(source)) failures.push(`network fetch found in ${path}`)
}

const packageJson = readFileSync(join(projectRoot, 'package.json'), 'utf8')
for (const serverDependency of ['express', 'fastify', 'hono', 'koa']) {
  if (new RegExp(`"${serverDependency}"\\s*:`).test(packageJson)) {
    failures.push(`server dependency found: ${serverDependency}`)
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log('No backend, network policy loading, or browser persistence was introduced.')
