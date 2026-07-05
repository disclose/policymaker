#!/usr/bin/env node
// Sync policymaker's served term templates FROM the canonical dioterms source.
// dioterms (vendor/dioterms, a pinned git submodule) is the single source of
// truth for disclosure-policy language; this script projects it into the shape
// policymaker's Nuxt app serves (static/templates/disclose-io-<name>/<locale>.md).
//
// Run at build (before `nuxt generate`) and committed as a snapshot. Idempotent:
// if the committed templates already match the pinned submodule, it writes nothing.
//
//   node scripts/sync-templates.mjs
//
// To take a newer dioterms: bump the submodule pin (a reviewed, logged commit),
// then re-run this. Never edit static/templates/disclose-io-* by hand — dioterms
// is authoritative; hand edits are overwritten on the next sync.

import { readFileSync, writeFileSync, readdirSync, rmSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'vendor', 'dioterms')
const OUT = join(ROOT, 'static', 'templates')

// dioterms term-set folder  ->  policymaker template folder
const MAP = {
  'vdp': 'disclose-io-vdp',
  'vdp-with-cvd': 'disclose-io-vdp-with-cvd',
  'safe-harbor': 'disclose-io-safe-harbor',
  'simple-safe-harbor': 'disclose-io-simple-safe-harbor',
}

if (!existsSync(join(SRC, 'terms'))) {
  console.error('[sync] vendor/dioterms not checked out — run `git submodule update --init`')
  process.exit(1)
}

// Strip a leading dioterms provenance HTML comment so it never leaks into a
// generated policy the user copies. Only removes a comment that is the very
// first thing in the file.
function stripProvenance(md) {
  const m = md.match(/^﻿?\s*<!--[\s\S]*?-->\s*\n/)
  return m ? md.slice(m[0].length) : md
}

const locales = JSON.parse(readFileSync(join(SRC, 'terms', 'languages.json'), 'utf8')).languages
let wrote = 0, removed = 0

for (const [term, dir] of Object.entries(MAP)) {
  const outDir = join(OUT, dir)
  mkdirSync(outDir, { recursive: true })

  // Write each canonical locale.
  for (const loc of locales) {
    const srcFile = join(SRC, 'terms', term, `${loc}.md`)
    if (!existsSync(srcFile)) { console.warn(`[skip] ${term}/${loc} not in dioterms`); continue }
    const body = stripProvenance(readFileSync(srcFile, 'utf8'))
    const outFile = join(outDir, `${loc}.md`)
    const cur = existsSync(outFile) ? readFileSync(outFile, 'utf8') : null
    if (cur !== body) { writeFileSync(outFile, body); console.log(`[write] ${dir}/${loc}.md`); wrote++ }
  }

  // Remove any locale file no longer in the canonical set (e.g. the old np-NP).
  for (const f of readdirSync(outDir)) {
    if (!f.endsWith('.md')) continue
    if (!locales.includes(f.replace(/\.md$/, ''))) {
      rmSync(join(outDir, f)); console.log(`[remove] ${dir}/${f} (locale not in dioterms)`); removed++
    }
  }
}

// Mirror the canonical locale manifest.
const langOut = join(OUT, 'languages.json')
const langBody = JSON.stringify({ languages: locales }, null, 2) + '\n'
if (!existsSync(langOut) || readFileSync(langOut, 'utf8') !== langBody) {
  writeFileSync(langOut, langBody); console.log('[write] languages.json'); wrote++
}

console.log(`\n[sync] locales=${locales.join(',')} · wrote=${wrote} removed=${removed}`)
