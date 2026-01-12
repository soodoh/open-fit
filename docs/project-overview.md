# Project Overview - open-fit

## Summary

**open-fit** is an open-source fitness tracking web application that allows users to create workout routines, track exercise sessions, and monitor their fitness progress over time.

## Purpose

The application solves the common problem of tracking workouts by providing:
- **Routine Templates:** Create reusable workout plans with multiple days
- **Exercise Library:** Browse 800+ exercises with instructions and images
- **Session Tracking:** Log sets, reps, and weights in real-time
- **Progress History:** View past workouts and track improvements

## Project Classification

| Attribute | Value |
|-----------|-------|
| **Type** | Web Application |
| **Repository** | Monolith (single codebase) |
| **Architecture** | Full-stack Serverless |
| **License** | GPL-3.0 |

## Technology Summary

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Backend** | Convex (serverless BaaS) |
| **Database** | Convex Document Database |
| **Auth** | Convex Auth (email/password) |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Package Manager** | pnpm |

## Key Features

### Routine Management
- Create workout routines with multiple days
- Add exercises from library to routine days
- Configure default rest times
- Reorder and organize exercises

### Workout Sessions
- Start sessions from routine templates
- Track sets with weight, reps, and type
- Built-in rest timer between sets
- Mark sets as completed (warmup, working, drop, failure)

### Exercise Library
- 800+ exercises with images
- Muscle group categorization
- Equipment requirements
- Step-by-step instructions

### User Experience
- Real-time sync (no refresh needed)
- Dark/light theme support
- Mobile-responsive design
- Drag-and-drop reordering

## Repository Structure

```
open-fit/
├── app/          # Next.js pages (9 routes)
├── components/   # React components (~65 files)
├── convex/       # Backend (schema, queries, mutations)
├── lib/          # Shared utilities
├── public/       # Static assets (exercise images)
└── docs/         # Project documentation
```

## Quick Links

| Document | Description |
|----------|-------------|
| [Architecture](./architecture.md) | System design and technical decisions |
| [Source Tree](./source-tree-analysis.md) | Directory structure and file organization |
| [Development Guide](./development-guide.md) | Setup and development workflow |
| [Component Inventory](./component-inventory.md) | UI component catalog |

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start Convex backend: `docker compose up -d`
4. Deploy Convex functions: `npx convex deploy`
5. Start dev server: `pnpm dev`
6. Open http://localhost:3000

See [Development Guide](./development-guide.md) for detailed instructions.
