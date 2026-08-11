import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const projectRoot = process.cwd()
const packageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8')) as {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}
const dependencyNames = Object.keys({
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
})
const bannedDependencies = [
  'nuxt',
  '@nuxt/content',
  '@nuxt/types',
  '@nuxt/typescript-build',
  'vuex',
  'vuex-module-decorators',
  'lodash',
]
const bannedPaths = [
  '.eslintrc.js',
  '.nvmrc',
  '.prettierrc',
  'nuxt.config.js',
  'package 2.json',
  'package-lock.json',
  'tailwind.config.js',
  'tsconfig 2.json',
  'vue-country.d.ts',
  'yarn.lock',
  'assets',
  'components',
  'content',
  'lang',
  'layouts',
  'mixins',
  'pages',
  'plugins',
  'scripts/sync-templates.mjs',
  'static',
  'store',
  'types',
  'utils',
]
const failures: string[] = []

for (const dependency of bannedDependencies) {
  if (dependencyNames.includes(dependency)) failures.push(`legacy dependency remains: ${dependency}`)
}

for (const path of bannedPaths) {
  if (existsSync(join(projectRoot, path))) failures.push(`legacy path remains: ${path}`)
}

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name)
    return statSync(path).isDirectory() ? sourceFiles(path) : [path]
  })
}

for (const path of sourceFiles(join(projectRoot, 'src'))) {
  if (!/\.(ts|vue)$/.test(path)) continue
  const source = readFileSync(path, 'utf8')
  if (/fetch\s*\(.*templates\//s.test(source)) {
    failures.push(`runtime template fetch remains: ${path}`)
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log('No legacy framework, source tree, or runtime template loading remains.')
