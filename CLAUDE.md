# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: Non-standard Next.js version

This project uses **Next.js 16.2.6** with **React 19.2.4** — versions that may differ significantly from your training data. APIs, conventions, and file structure may have changed. Before writing any Next.js code, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.

The docs are organized as:
- `node_modules/next/dist/docs/01-app/` — App Router (used in this project)
- `node_modules/next/dist/docs/02-pages/` — Pages Router
- `node_modules/next/dist/docs/03-architecture/`

## Commands

```bash
yarn dev        # Start dev server on localhost:3000
yarn build      # Production build
yarn start      # Run production build
yarn lint       # ESLint (eslint-config-next core-web-vitals + TypeScript rules)
```

No test runner is configured yet.

## Stack

- **Next.js 16.2.6** — App Router, TypeScript, no Pages Router
- **React 19.2.4**
- **Tailwind CSS v4** — configured via `@import "tailwindcss"` in `globals.css`; theme tokens defined with `@theme inline` (v4 syntax, not `tailwind.config.*`)
- **@optimizely/cms-sdk ^2.0.0** — headless CMS client; initialize with `GraphClient` using a single app key
- **@optimizely/cms-cli ^2.0.0** — syncs TypeScript content type definitions to Optimizely CMS; requires `.env` with `OPTIMIZELY_CMS_URL`, `OPTIMIZELY_CMS_CLIENT_ID`, `OPTIMIZELY_CMS_CLIENT_SECRET`

## Architecture

App Router structure under `app/`:
- `layout.tsx` — root layout; loads Geist/Geist Mono via `next/font/google`, sets CSS variable font assignments
- `page.tsx` — home route
- `globals.css` — Tailwind v4 import + CSS custom properties for `--background`/`--foreground` and dark mode

Path alias `@/*` maps to the project root (e.g. `@/app/...`, `@/lib/...`).

Tailwind v4 note: there is no `tailwind.config.ts`. Customizations go in `globals.css` using `@theme`.

## Design Context

Full design specs live in [PRODUCT.md](PRODUCT.md) and [DESIGN.md](DESIGN.md). Read both before any UI work.

**Register:** Brand (marketing site — design IS the product)
**North Star:** "The Kinetic Editorial" — precision-crafted, editorial confidence, choreographed motion
**Key constraints:**
- Committed color strategy: one saturated anchor fills 30–60% of the surface (not an accent)
- Serif display + sans body typography; serif never below 1.5rem
- Choreographed entrances only; flat at rest; no resting shadows; `prefers-reduced-motion` required
- WCAG 2.1 AA on all text and interactive states

**Hard prohibitions (from DESIGN.md):** no gradient text, no side-stripe borders >1px, no SaaS-cream/blob aesthetic, no corporate navy, no neon-on-black/Web3 energy, no layout-property animations.
