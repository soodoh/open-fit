# open-fit Documentation Index

> Fitness tracking web application built with Next.js 16 and Convex

## Project Overview

| Attribute | Value |
|-----------|-------|
| **Type** | Web Application (monolith) |
| **Language** | TypeScript |
| **Framework** | Next.js 16.1.1 + React 19 |
| **Backend** | Convex 1.31.3 (serverless BaaS) |
| **Architecture** | Full-stack Serverless |

## Quick Reference

| | |
|--|--|
| **Tech Stack** | Next.js 16, React 19, Convex, Tailwind CSS, shadcn/ui |
| **Entry Point** | `app/layout.tsx` |
| **Backend Entry** | `convex/schema.ts` |
| **Architecture Pattern** | Component-based UI + Convex reactive queries |
| **Package Manager** | pnpm 10.27.0 |

## Generated Documentation

### Core Documents

| Document | Description |
|----------|-------------|
| [Project Overview](./project-overview.md) | High-level project summary and purpose |
| [Architecture](./architecture.md) | System design, tech stack, data models |
| [Source Tree Analysis](./source-tree-analysis.md) | Directory structure and file organization |

### Development

| Document | Description |
|----------|-------------|
| [Development Guide](./development-guide.md) | Setup instructions and dev workflow |
| [Component Inventory](./component-inventory.md) | UI component catalog (~65 components) |

### API & Data _(To be generated)_

| Document | Description |
|----------|-------------|
| [API Contracts](./api-contracts.md) | Convex queries and mutations _(To be generated)_ |
| [Data Models](./data-models.md) | Database schema details _(To be generated)_ |

## Existing Documentation

| Document | Description |
|----------|-------------|
| [README](../README.md) | Original project README with setup guide |
| [Convex README](../convex/README.md) | Convex boilerplate documentation |

## Key Directories

```
open-fit/
├── app/          # Next.js pages (9 routes)
├── components/   # React components (~65 files)
├── convex/       # Convex backend (schema, queries, mutations)
├── lib/          # Shared utilities
├── public/       # Static assets (800+ exercise images)
└── docs/         # This documentation
```

## Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Home | Dashboard |
| `/signin` | Sign In | Authentication |
| `/register` | Register | New user signup |
| `/routines` | Routines | Workout routine management |
| `/exercises` | Exercises | Exercise library (800+) |
| `/logs` | Logs | Workout history |
| `/logs/[session]` | Session | Individual session details |
| `/day/[day]` | Day | Daily workout view |

## Getting Started

### For Development
```bash
pnpm install
docker compose up -d
npx convex deploy
pnpm dev
```

### For AI-Assisted Development

When working with AI assistants on this codebase:

1. **Understanding the codebase:** Start with [Architecture](./architecture.md)
2. **Finding components:** Check [Component Inventory](./component-inventory.md)
3. **File locations:** Reference [Source Tree Analysis](./source-tree-analysis.md)
4. **Setup issues:** Consult [Development Guide](./development-guide.md)

### For Feature Planning (PRD)

When creating a PRD for new features:

1. Review [Architecture](./architecture.md) for existing patterns
2. Check [Component Inventory](./component-inventory.md) for reusable components
3. Reference [Source Tree Analysis](./source-tree-analysis.md) for file placement

## Domain Concepts

| Concept | Description | Location |
|---------|-------------|----------|
| **Routine** | Workout template with days | `convex/mutations/routines.ts` |
| **RoutineDay** | Day within a routine | `convex/mutations/routineDays.ts` |
| **Session** | Active/completed workout | `convex/mutations/sessions.ts` |
| **SetGroup** | Exercise instance in session | `convex/mutations/setGroups.ts` |
| **Set** | Individual set (weight/reps) | `convex/mutations/sets.ts` |
| **Exercise** | Exercise definition | `convex/queries/exercises.ts` |

## Documentation Generation Info

| | |
|--|--|
| **Generated** | 2026-01-11 |
| **Scan Level** | Quick (pattern-based) |
| **Workflow** | document-project |

---

*This index is the primary entry point for AI-assisted development. For updates, re-run `/bmad:bmm:workflows:document-project`.*
