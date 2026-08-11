# Architecture

policymaker is a client-only Vue 3 application that compiles to static files. It has no application backend, account system, database, or browser persistence.

## Policy and artifact flow

```mermaid
flowchart LR
  D["Pinned vendor/dioterms submodule"] --> G["Build-time policy generator"]
  G --> T["Generated typed policy module"]
  T --> A["Semantic availability checks"]
  A --> S["In-memory wizard state"]
  S --> R["Pure artifact generators"]
  R --> U["Preview and downloads"]
  U --> Z["Static GitHub Pages deployment"]
```

1. `.gitmodules` pins DIOTerms at `vendor/dioterms`.
2. `scripts/generate-policy-source.ts` reads `terms/languages.json` and all supported policy families from that checkout.
3. The generator strips only the upstream provenance comment and emits `src/generated/policies.ts`. The file is ignored because the submodule is the source of truth.
4. `src/domain/policies.ts` evaluates semantic availability. Base VDPs require organization and disclosure-channel placeholders; coordinated-disclosure policies also require the window placeholder; duplicate cross-family bodies are rejected.
5. The wizard holds configuration in Vue reactive memory. Reloading the page resets it.
6. Pure domain functions generate policies, safe harbor, security.txt, DNS Security TXT, HTML/Markdown downloads, and the deployment ZIP.

`bun run policies:check` regenerates the expected module in memory and requires byte equality with the local generated file. Production builds always generate first.

## Application layers

| Layer | Location | Responsibility |
|---|---|---|
| Entrypoint and routing | `src/main.ts`, `src/router.ts` | Mount Vue and preserve the public route contract |
| Wizard state | `src/state/policymaker.ts` | In-memory answers, derived completion state, and route gating |
| Domain | `src/domain/` | Policy selection, URI/domain/language validation, artifact generation, ZIP creation, downloads, and analytics contracts |
| Components | `src/components/` | Accessible reusable controls, previews, progress, tabs, and DNS rows |
| Views | `src/views/` | Route-specific wizard and download composition |
| Guidance | `src/content/` | Explanatory product text; never canonical policy wording |
| Build scripts | `scripts/` | Policy ingestion, architecture/legacy gates, direct-route output, and distribution verification |

## Public route contract

Vite builds one single-page application. `scripts/generate-static-routes.ts` then writes direct static entries so GitHub Pages can serve every historical path without relying on a server rewrite:

- `/` — landing page, carries the introduction prose from `src/content/introduction.md`
- `/policymaker` — legacy path, redirects to `/`
- `/policymaker/introduction` — legacy path, redirects to `/`
- `/policymaker/organization`
- `/policymaker/settings`
- `/policymaker/download`
- `/policymaker/download/vdp`
- `/policymaker/download/safe-harbor-clause`
- `/policymaker/download/securitytxt`
- `/policymaker/download/dnssecuritytxt`

The two legacy paths stay in `ROUTES` so the static build still emits a 200-status entry for each; the router redirects them to `/`, where the introduction prose now lives. `404.html` provides the static-host fallback. Router guards send incomplete protected flows back to `/policymaker/organization`, the first input step.

## Standards boundaries

- Web contacts and policy locations must be valid HTTPS URLs. Bare emails normalize to `mailto:` and bare host inputs normalize to HTTPS where unambiguous.
- Reporting-language values are canonical BCP 47 tags and are emitted only when explicitly provided.
- security.txt expires 364 days after generation and is intended for HTTPS `/.well-known/security.txt` as UTF-8 `text/plain`.
- DNS records use `_security.<domain>` and include one `security_expires` value.
- Policy bodies always come from the pinned DIOTerms revision; application prose never becomes policy source.

These contracts live in pure functions and are exercised with examples plus property-based tests.

## Static delivery and privacy

The production bundle contains only static assets. Configuration is not written to local storage, session storage, IndexedDB, a cookie, or a backend. Generated downloads are assembled locally with browser object URLs.

`scripts/check-architecture.ts` guards the no-backend, no-runtime-policy-fetch, and no-persistence boundaries. `scripts/check-legacy.ts` prevents old Nuxt surfaces or duplicate runtime policy templates from returning.

## Change map

- Policy wording or translation: change DIOTerms, then update the submodule.
- Artifact format or validation: change `src/domain/` and its tests.
- Wizard behavior: change state, components/views, and router/component tests.
- Public copy: change `src/content/` or the relevant view.
- Route inventory or metadata: change the generator/public assets and `scripts/verify-dist.ts`.
- Deployment: change `.github/workflows/deploy.yml` and update `docs/DEPLOYMENT.md` in the same pull request.
