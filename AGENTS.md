# AGENTS.md

Instructions for AI agents working in `proxies-service`.

## Architecture & Layout

- **Pattern**: Clean Architecture using native Node.js ESM (`"type": "module"`).
  - `src/domain/`: Core entities and repository/event bus interfaces (dependency-free).
  - `src/application/`: Application business logic, use cases (`src/application/use-cases/proxies/`), and DTO interfaces.
  - `src/adapters/`: Interface adapters (`ProxiesController`, `auth.middleware.ts`, `validation.middleware.ts`, `ProxiesValidator`, `NodeProxyEventBus`).
  - `src/config/`: Application configuration, logger (`logger.ts`), and database initialization (`database.ts`).
  - `src/infrastructure/`: Frameworks, drivers, and external adapters:
    - `database/lowdb/`: LowDB repository implementation (`LowDbProxyRepository`).
    - `http/`: Express setup (`server.ts`), router composition root (`router.ts`), and route handlers (`routers/`).
    - `events/`: Global EventEmitter instance (`ProxiesEmitter`).
  - `src/docs/`: OpenAPI / Swagger specification (`swagger.json`).
- **Persistence**: File-based via `lowdb` writing to `config.json` at root directory (gitignored). Initialized in `src/config/database.ts`.
- **Proxy Routing**: Express dynamically dispatches `/:namespace` routes to targets via `express-http-proxy` after static and management routes (`/`, `/docs`, `/metrics`, `/proxies`). Unmatched namespaces return 404.

## Critical Quirks

- **Authentication**: Auth middleware checks query parameter `?token=<TOKEN>` (`request.query.token`), **not** an `Authorization` header.
- **Import Extensions & Path Aliases**: TypeScript ESM imports require `.js` extensions (e.g. `import ... from '@/adapters/middlewares/auth.middleware.js'`). Use the `@/*` alias for cross-layer/distant imports, keeping relative paths (`./...`) only for nearby/sibling files.
- **Feature Flags**:
  - `ENABLE_PROXIES_CRUD`: Defaults to `'true'`. Toggles `/proxies` endpoints.
  - `ENABLE_METRICS_ROUTER`: Defaults to `'false'`. Toggles `/metrics` endpoint.
  - `ENABLE_SWAGGER`: Defaults to `'true'`. Toggles `/docs` endpoint.

## Developer Commands

```sh
# Development server with live reload and formatted logs
npm run start:dev

# Build (tsdown bundles to dist/index.mjs)
npm run build

# Typecheck (no package.json script exists)
npx tsc --noEmit

# Lint & autofix
npm run lint
npm run lint:fix

# Run all tests
npm test

# Run a single test file
npm test -- test/healthcheck.spec.js

# Run tests matching a pattern/name
npm test -- -t "should proxy to the api"

# Coverage
npm run test:cov

# Standard verification pipeline
npm run lint && npx tsc --noEmit && npm test && npm run build
```

## Testing Quirks

- **Vitest**: Tests run via Vitest natively with ESM support.
- **Test Specs**: Tests reside in `test/*.spec.js` using ESM.
- **Server/DB Isolation**: Tests import `server.ts` and `database.ts` dynamically with cache-busting queries (`?time=${Date.now()}`) via `test/helpers/load-server.js` and `test/helpers/load-db.js`.
- **HTTP Mocking**: External proxy target responses in tests are intercepted using `nock`.

## Git & Workflow

- **Branching**: Default working branch is `develop`. PRs merge from `develop` into `main`.
- **Commits**: Conventional Commits strictly enforced by Husky + Commitlint (`commitlint.config.js`). Never commit without explicit user permission.
