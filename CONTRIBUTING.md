# Contributing to policymaker

Thanks for helping improve policymaker. Application behavior lives here; canonical policy language lives in [disclose/dioterms](https://github.com/disclose/dioterms).

## Set up the repository

Use Bun 1.3.6 or newer and clone the DIOTerms submodule with the application:

```bash
git clone --recurse-submodules https://github.com/disclose/policymaker.git
cd policymaker
bun install --frozen-lockfile
bun run verify
```

For an existing checkout, synchronize the pinned submodule before working:

```bash
git submodule update --init --recursive
```

## Choose the correct repository

- Change Vue screens, validation, artifact generation, accessibility, or deployment here.
- Change policy wording, translations, or locale declarations in DIOTerms.
- Do not edit `src/generated/policies.ts`. It is a local build artifact generated from `vendor/dioterms`.
- Do not copy policy bodies into components, content files, tests, or `public/`.

Source availability and UI availability are deliberately different concepts. DIOTerms declares source locales in `terms/languages.json`; policymaker offers a locale for a policy family only when that body contains the required placeholders and is not duplicated from another family.

## Development conventions

- Use TypeScript and Vue 3 Composition API.
- Keep validation and generation in pure modules under `src/domain/`.
- Keep wizard data in the in-memory state module; do not add accounts, storage, analytics payload data, or backend persistence.
- Preserve the existing public route and artifact filename contracts.
- Associate every visible form prompt with its control and expose specific validation feedback through visible text and ARIA attributes.
- Treat HTTPS and standards constraints as generation preconditions, not deployment suggestions.
- Add focused unit tests and a property test when a rule describes a class of inputs.

## Update DIOTerms

The audited update command fetches DIOTerms `main`, checks out the fetched revision in the submodule, regenerates policies, and runs the full verification suite:

```bash
bun run policies:update
```

After it succeeds:

1. Review `git diff --submodule=log vendor/dioterms` and the command's old/new revision output.
2. Confirm any newly available or unavailable locale/family combinations are intentional.
3. Exercise affected variants in the browser.
4. Commit the updated submodule pointer with any necessary application or documentation changes.

Do not merge an update that fails semantic availability or source-fidelity checks. Fix canonical wording upstream rather than weakening the checks locally.

## Verify a change

Run the complete gate:

```bash
bun run verify
```

For UI changes, also complete the four-step wizard at desktop and mobile sizes, inspect the browser console, and download the affected artifacts. Validate their actual contents rather than only checking that a button was clicked.

## Pull-request checklist

- [ ] The change belongs in policymaker rather than DIOTerms.
- [ ] Public routes, filenames, and valid-input behavior remain compatible unless the PR explicitly changes the contract.
- [ ] Tests cover new behavior and regression classes.
- [ ] `bun run verify` passes from the intended commit.
- [ ] User-facing and maintainer documentation is current.
- [ ] No generated output, credentials, local task files, or machine-specific paths are committed.
