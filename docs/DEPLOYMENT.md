# Deployment

Production is a static GitHub Pages site at [policymaker.disclose.io](https://policymaker.disclose.io). The canonical deployment definition is `.github/workflows/deploy.yml`.

## Release path

1. A pull request runs the same build job used for production.
2. A push to `main` checks out submodules recursively, installs the frozen Bun lockfile, and runs `bun run verify`.
3. Only after verification succeeds does the workflow publish `dist/` to the `gh-pages` branch.
4. `public/CNAME` preserves the custom domain in the deployed artifact.

The deployment job intentionally has no separate server or runtime configuration. GitHub repository Pages settings must serve the `gh-pages` branch from its root, and DNS for `policymaker.disclose.io` must continue to target GitHub Pages.

## Pre-release checks

From a checkout of the exact commit intended for `main`:

```bash
git submodule update --init --recursive
bun install --frozen-lockfile
bun run verify
bun run preview
```

Verify the complete wizard in a real browser at both desktop and mobile widths. Confirm:

- the organization, settings, VDP, safe-harbor, security.txt, and DNS steps render;
- invalid HTTP URLs and malformed domains are blocked;
- all available policy locales preview without unresolved placeholders;
- individual artifacts and the ZIP download contain the configured values;
- browser console errors and warnings are absent.

## Post-deployment verification

After the `Build and Deploy` workflow finishes:

1. Open `https://policymaker.disclose.io/` with cache bypassed and confirm the introduction prose renders beneath the hero.
2. Complete the wizard with a test organization and at least one reporting channel.
3. Inspect VDP, safe-harbor, security.txt, and DNS outputs.
4. Download the deployment ZIP and inspect its seven-file inventory.
5. Confirm direct navigation to each public route returns the application, including that the two legacy paths `/policymaker` and `/policymaker/introduction` return HTTP 200 and land on `/`.
6. Confirm the production console contains no application errors.

Do not treat a successful HTTP probe alone as browser verification; GitHub Pages routing and cached browser assets must be exercised through the user path.

## Failed deployments

The deploy step is gated on the build job. If verification fails, production remains on the previous `gh-pages` revision. Fix the failing source or test on a branch and rerun the workflow; never bypass `bun run verify` or publish `dist/` manually.

## Rollback

Revert the problematic commit on `main` and push the revert. The normal workflow rebuilds and republishes the prior application state from source. This preserves an auditable history and keeps `gh-pages` derived rather than hand-maintained.

If GitHub Pages itself is unavailable, leave repository history unchanged and use the provider status plus workflow logs to distinguish hosting failure from an application regression.
