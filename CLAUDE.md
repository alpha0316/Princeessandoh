# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Type-check (tsc -b) then Vite build
npm run lint       # ESLint
npm run preview    # Preview production build
```

There is no test runner configured.

## Architecture

This is a React 19 + TypeScript + Vite portfolio site — a single-page app presenting a shuttle tracking case study for Ghanaian universities (KNUST, UG, UCC). All data is static/mock; there are no API calls.

### Routing

Routing is handled manually in [src/app/App.tsx](src/app/App.tsx) via `useState` — no router library. The top-level `page` state switches between `"home"`, `"shuttle"`, and `"messages"`.

### Feature structure

All domain logic lives in [src/features/](src/features/):

**`shuttle/`** — the bulk of the app.
- `ShuttleDetailPage.tsx` — root container with three tabs: product, design, engineering.
- `screens/` — 19+ simulated mobile screen components (splash, home, search, tracking, etc.) rendered inside a phone mockup.
- `screenSeries/` — ordered arrays of screens for each tab section (product, design, engineering flows).
- `engine/` — geospatial calculation utilities (shuttle position, bearing, ETA) using Turf.js.
- `data/` — static shuttle routes, stops, and schedule data.
- `types/` — shared TypeScript interfaces for the shuttle domain.
- `DesignSection.tsx`, `EngineeringSection.tsx`, `FlowSection.tsx` — case study narrative sections, each with a companion `*.css` file for bespoke styling.

**`messages/`** — a secondary feature showing a mock chat UI with hardcoded conversation data.

### Maps

Two mapping libraries coexist:
- **React-Leaflet** (`react-leaflet` + `leaflet`) — used for interactive maps inside phone-mockup screens.
- **Mapbox GL** (`mapbox-gl`) — used for higher-fidelity map views in the engineering section.

Shared geographic data (university campus coordinates, mock bus routes) lives in [src/data/](src/data/).

### Styling

Tailwind CSS is the default utility layer. Individual feature sections with complex visual layouts (`DesignSection`, `EngineeringSection`, `FlowSection`) use dedicated CSS files alongside Tailwind. Global base styles are in [src/styles/app.css](src/styles/app.css).

### TypeScript config

Strict mode is on (`strict`, `noUnusedLocals`, `noUnusedParameters`). Module resolution is set to `bundler` (Vite-style). Keep all types tightly scoped — avoid `any`.
