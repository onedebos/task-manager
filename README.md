# Task Manager

A minimal TypeScript starter harness for a 90-minute collaborative coding interview. The four service methods are intentionally left unimplemented on `main`.

## Setup

```bash
npm install
```

## Commands

```bash
npm test               # Run tests once
npm run test:watch     # Run tests in watch mode
npm run typecheck      # Check TypeScript types
```

## Structure

- `src/models/` — task types and inputs
- `src/repositories/` — in-memory task storage
- `src/services/` — task business logic
- `src/clock.ts` — injectable clock for deterministic tests
- `tests/` — Vitest tests
- `AGENTS.md` — requirements, assumptions, and AI collaboration workflow

## Methods to implement

- `createTask(input)`
- `completeTask(title)`
- `listPendingByPriority(priority)`
- `listOverdueTasks()`

See `AGENTS.md` for the agreed behaviour and implementation workflow.
