# Agents — Best practices for working on a T3 (create-t3) app

This document collects practical, repeatable conventions and workflows to follow when building and maintaining apps created with the T3 stack (create-t3). It covers repo layout, local setup, development workflows, architecture, quality, security, deployment and maintenance. Use this as a checklist for new projects and when onboarding contributors.

---

use bun for package manager

## Quick checklist

- [ ] Use the app router (Next) intentionally — know server vs client components
- [ ] TypeScript: `strict: true` and no `any` unless justified
- [ ] Prisma: migrations in VCS, `prisma migrate` for schema changes, seed script
- [ ] tRPC: keep routers small, typesafe inputs/outputs, consistent error handling
- [ ] Styling: Tailwind with configuration and component classes
- [ ] Linting & formatting: ESLint, Prettier, Husky, lint-staged, commitlint
- [ ] Tests: unit (Vitest/Jest), e2e (Playwright/Cypress)
- [ ] CI: run tests, lint, build, and preview deploy
- [ ] Deploy: Vercel (recommended), keep environment variables consistent
- [ ] Backups & monitoring: DB backups, Sentry/LogRocket or similar for errors

---

## Project structure / conventions

- Keep a standard structure so contributors find things quickly:
  - app/ (Next app router) or pages/ (legacy)
  - src/
    - server/ (tRPC routers, auth, prisma client wrapper, server utilities)
    - client/ (hooks, api client wrappers, UI library)
    - components/ (shared React components)
    - styles/ (tailwind config, global styles)
    - prisma/ (schema.prisma, seeds)
    - tests/ (unit + e2e)
- Prefer `src/` for application code to avoid root crowding.
- If using the app router, place page-level components in `app/` and keep server logic in `server/` or `lib/`.

---

## TypeScript & coding standards

- Enable `strict: true` in tsconfig.json.
- Prefer explicit types for public API boundaries (controllers/routers/hooks).
- Avoid `any`. Use `unknown` + narrow or add TODOs for refactor.
- Use ESLint with recommended rules and plugin-react, plugin-react-hooks, plugin-jsx-a11y.
- Use Prettier or Prettier + ESLint integration and run via pre-commit hooks (lint-staged).
- Write readable commits; follow Conventional Commits (enforced by commitlint + Husky).

Example useful tsconfig settings:

- "noImplicitAny": true
- "strictNullChecks": true
- "forceConsistentCasingInFileNames": true
- "isolatedModules": true

---

## Next.js-specific guidance

- Choose router intentionally:
  - app router: prefer Server Components for data fetching, use client components only when needed.
  - pages router: OK if you need stability or older patterns.
- Keep server-only code (Prisma, secrets) in server components or `server/` utilities — never expose secrets to browser bundles.
- Use `getServerSideProps` or server components for data that must be fresh; use static generation + revalidation where possible for performance.
- Use Next/Image or an image CDN for performance; configure domains in next.config.js.
- For dynamic routes and data, prefer type-safe interfaces at the API/tRPC boundary.

---

## tRPC (or API) best practices

- Organize routers by domain (e.g., `user`, `post`, `billing`) and create an index router.
- Keep each RPC small and single-responsibility.
- Validate inputs with Zod (or run-time schema) at the router input layer.
- Return typed responses; avoid returning Prisma raw objects directly — map to DTOs when needed.
- Standardize error handling: use TRPCError and consistent error codes/messages.
- Never call client-only code in server endpoints.

Example pattern:

- src/server/trpc/context.ts — builds context with prisma + auth info
- src/server/routers/index.ts — combine routers
- src/server/routers/user.ts — user routes (Zod inputs + outputs)

---

## Prisma & database

- Keep `schema.prisma` in `prisma/` and add generated client to .gitignore, but commit `schema.prisma`.
- Use migrations (`prisma migrate dev` / `prisma migrate deploy`) — store migration files in VCS.
- Provide `prisma/seed.ts` and a `bun`/`npm` script for seeding local dev data.
- Run `prisma generate` in CI if necessary.
- For schema changes:
  - Create a draft branch
  - Add migration, test locally against a copy of production-like DB
  - Apply in staging before production
- Add database backups and a disaster recovery plan (automated backups for production DB).

Common commands to document in README:

- bun prisma migrate dev
- bun prisma migrate deploy
- bun prisma db seed
- bun prisma studio

---

## Environment variables

- Provide a `.env.example` with required variables and descriptions.
- Do not commit `.env`.
- Use typed env helpers (like zod) to validate runtime env presence.
- For local dev, keep consistent variable names with production (e.g., DATABASE_URL).
- In PRs, avoid including live secrets — use staging/test values.

---

## Styling & UI

- Use Tailwind CSS with an explicit config file and documented design tokens.
- Keep a small component library inside `components/ui/` for buttons, inputs, layout primitives.
- Prefer composition over classnames duplication; use utility class composition helpers (clsx).
- Keep global CSS minimal; prefer Tailwind + component-level styles.

---

## Authentication & authorization

- If using Clerk/NextAuth/Firebase, centralize auth logic in `src/server/auth` or similar.
- Enforce server-side authorization at the tRPC or API boundary — never trust client data.
- Add role-based RBAC checks in middleware where appropriate.
- Keep session token expiry and refresh logic documented.

---

## Testing

- Unit tests: Vitest (fast), Jest also valid. Put tests beside files or in `tests/`.
- Integration/e2e: Playwright or Cypress. Include CI jobs that run e2e against a built preview or ephemeral environment.
- Test database: use a separate test DB and migrate+seed in setup.
- Coverage: keep a reasonable threshold (e.g., >70%) and enforce via CI only after growth.

Example scripts:

- bun test:unit
- bun test:e2e
- bun test:watch

---

## Lint, format, and pre-commit

- Add Husky + lint-staged to run:
  - Prettier format changes
  - ESLint fix
  - Type check (optional, slower)
- Enforce commit message format with commitlint.

---

## CI/CD

- CI should run: install, lint, typecheck, unit tests, build.
- Optional: run e2e tests against preview deployment.
- Use Dependabot or Renovate for dependency updates.
- For deploys: Vercel is the easiest for Next apps; document required environment variables in project settings.

Example GitHub Actions steps:

- checkout
- setup node
- cache bun
- install
- prisma migrate/deploy (staging)
- build
- run tests
- deploy preview

---

## Security & secrets

- Keep secrets in the host (Vercel Env, GitHub Secrets).
- Rotate keys periodically.
- Use parameterized queries (Prisma does this), sanitize inputs, and validate on server.
- Audit dependencies (npm audit, GitHub Dependabot alerts).
- Set CSP, X-Frame-Options, HSTS via next.config or middleware.
- Limit CORS to required origins.

---

## Observability & errors

- Use Sentry, Datadog, or similar for error tracking and performance monitoring.
- Centralize server logging (structured JSON), and ensure logs include traceable request/user ids.
- Add health endpoints and uptime checks.
- Monitor key metrics: request latency, DB connection errors, error rate.

---

## Performance & scalability

- Use SSR + caching (ISR / revalidate) for pages that can be cached.
- Use edge functions when low latency required (evaluate cold starts).
- Use pagination and cursor-based queries for heavy lists.
- Use Prisma connection pooling (e.g., PgBouncer) for serverless environments.
- Cache expensive computations at CDN or application level (Redis).

---

## Accessibility & internationalization

- Use semantic HTML, role attributes, and aria labels where needed.
- Run automated a11y checks (axe) during CI/e2e.
- For i18n, prefer next-i18next or Next built-in solutions; isolate translation keys.

---

## Releases, branching & PRs

- Branching model: trunk-based or git-flow — document chosen approach.
- PR checklist:
  - Passes CI (lint, tests, build)
  - Linked issue / description of change
  - Small, focused changes
  - DB migration included and documented if applicable
  - Screenshots or recordings for UI changes
- Use code owners for critical directories (server/, prisma/, infra/).

---

## Upgrading the T3 stack

- Keep a changelog for major upgrades.
- Test upgrades in a branch; run full CI and smoke tests.
- Check breaking changes for Next, Prisma, tRPC, Tailwind.
- Schedule upgrades and communicate downtime windows if DB migrations are required.

---

## Local dev experience

- Document how to:
  - Install (bun install)
  - Run dev server (bun dev)
  - Start DB locally (docker-compose or provided scripts)
  - Seed the DB (bun db:seed)
  - Access Prisma Studio (bun prisma:studio)
- Prefer a `scripts/` or `bin/` folder with helper scripts to bootstrap the environment for new contributors.

---

## Infrastructure & infra-as-code

- Keep infra code (Terraform, Pulumi) in a separate `infra/` directory or repo.
- Document how to provision staging / production resources.
- Keep secrets in secure vaults and CI/CD secret stores.

---

## Documentation & onboarding

- Maintain README with:
  - Purpose of the repo
  - Setup steps
  - Important scripts
  - Common troubleshooting tips
- Keep `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and `SECURITY.md`.
- Add an architectural overview diagram and data flow for complex apps.

---

## Appendix: Useful commands (example)

- Install: bun install
- Dev server: bun dev
- Build: bun build
- Start: bun start
- Prisma migrate (dev): bun prisma migrate dev
- Prisma migrate (prod): bun prisma migrate deploy
- Prisma studio: bun prisma studio
- Seed: bun db:seed
- Test unit: bun test
- Run lint: bun lint
- Format: bun format

---

Follow these practices as default guidelines and adapt them to your project's needs. When deviating, explicitly document why (tradeoffs, costs, and rollback plan). Keep the human workflows (PR process, code reviews, release cadence) as important as technical rules — consistency reduces cognitive overhead and defects.

If you want, I can convert this into a CONTRIBUTING.md section, produce a `.env.example` template, or generate GitHub Action workflows consistent with these practices.
