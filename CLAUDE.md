# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Wilson club fitter — a Vue 3 + Vite single-page app that lets users spec an iron or driver build (head, shaft, flex, grip, lie/length/wraps) and displays the resulting component SKUs and images. Deploys to GitHub Pages under the `/wilson-fitter/` base path.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build (outputs to `dist/`)
- `npm run preview` — preview the built bundle

No test or lint scripts are configured.

## Architecture

- **Entry**: `src/main.js` mounts `App.vue`. `App.vue` owns a single `clubType` ref and swaps between `IronBuilder` and `DriverBuilder` via `ClubTypeSelector`.
- **Catalog-driven**: `src/data/catalog.json` is the single source of truth for heads, shafts, grips, and config options (lie/length/flex/wraps/grip sizes). Both builders read from it through `composables/useCatalog.js`.
- **Builder composables** (`useIronBuilder.js`, `useDriverBuilder.js`) hold all reactive selection state plus cascading resets (e.g. changing `dex` clears `selectedHead`; changing shaft retries to preserve current flex). They expose computed `headSku`/`shaftSku`/`gripSku` and a final `build` object consumed by `BuildSummary.vue`. Images are computed separately and rendered by `ImagePanel.vue`.
- **SKU logic quirks worth knowing**:
  - Iron heads have a `sku_upright` variant that's selected when `selectedLie` is `1 UPRIGHT` / `2 UPRIGHT`.
  - Shafts keyed by flex via `shaft.flexes[flex]`; grips keyed by size via `grip.sizes[sizeKey]` (lowercased).
  - Some shafts/grips are `app_only` (no SKU) — `useCatalog` merges them into the list with a `hasSku` flag.
- **Image resolution** (`useCatalog.js`): files live under `public/images/{heads,shafts,grips}/` and are addressed as `${import.meta.env.BASE_URL}images/...`. Default convention is `${app_name}_Normal.png`; driver heads and a couple of iron heads use explicit `image` fields / hardcoded special cases. Always go through `getHeadImage` / `getShaftImage` / `getDriverShaftImage` / `getGripImage` so the GitHub Pages base URL is respected — do not hardcode `/images/...`.
- **Base path**: `vite.config.js` sets `base: '/wilson-fitter/'`. Any new asset references must use `import.meta.env.BASE_URL` (or live in `src/assets/` and be imported) or they will 404 on GitHub Pages.
