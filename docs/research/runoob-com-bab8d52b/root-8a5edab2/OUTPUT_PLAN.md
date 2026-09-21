# Output Plan

- Source URL: https://www.runoob.com/
- App root: .
- Site key: runoob-com-bab8d52b
- Page key: root-8a5edab2
- Destination route: /
- Artifact root: docs/research/runoob-com-bab8d52b/root-8a5edab2/
- Screenshot root: docs/design-references/runoob-com-bab8d52b/root-8a5edab2/
- Component root: src/components/sites/runoob-com-bab8d52b/root-8a5edab2/
- Shared site assets: src/components/sites/runoob-com-bab8d52b/shared/

## Why this mapping

The requested target resolves to the homepage and is a single-root clone. The existing scaffold route at src/app/page.tsx is the correct root route to replace, and no second origin or multi-site split is needed.

## Shared foundation changes

- Global fonts are being normalized to a Chinese-friendly system stack so the clone builds without the blocked network fetches from next/font/google.
- Global styling is kept page-scoped to the root route to avoid affecting unrelated scaffold routes.

## Build status

- Baseline build was validated before editing and failed because the default Geist Google font fetch is unavailable in this environment.
- The root cause was fixed by removing the remote Google font dependency.
