<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent guide for this workspace

This repo is a Next.js 16 + React 19 app for a configurable bundle builder. Keep changes aligned with the existing feature-oriented structure instead of introducing new patterns.

## Project map
- App entry and route shell: src/app/
- Bundle builder UI: src/components/builder/ and src/components/review/
- Shared bundle state and hooks: src/hooks/use-bundle.ts and src/stores/bundle-store.ts
- Domain logic, selectors, and types: src/features/bundle/
- Bundle data and static product config: src/data/
- Pricing and general helpers: src/lib/

## Working conventions
- Keep UI components presentational and place bundle business logic in the feature/selectors layer or the Zustand store.
- Reuse existing selectors and helpers rather than duplicating pricing, quantity, or line-resolution logic in components.
- The bundle schema comes from JSON data files and is typed in src/features/bundle/bundle.types.ts; update types and tests together when changing the data shape.
- Prefer the @/* import alias and keep new files colocated with the feature they support.
- Styling is Tailwind-first and uses shadcn-style primitives under src/components/ui/.

## Verification expectations
- Run npm run lint after edits that affect code, formatting, or imports.
- Run npm run test:run when changing bundle logic, selectors, store behavior, or UI components.
- For bundle-related changes, add or update the corresponding tests in the nearby __tests__ folder rather than relying on manual checks alone.

## State and persistence
- Bundle state is persisted in localStorage through Zustand persist middleware, so preserve the existing state shape when changing the store.
- Keep changes focused and avoid introducing a second state-management layer unless the current structure cannot support the feature.
