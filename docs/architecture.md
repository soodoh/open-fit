# Architecture Document - open-fit

> Fitness tracking web application built with Next.js and Convex

## Executive Summary

**open-fit** is a full-stack fitness tracking application that enables users to:
- Create and manage workout routines with customizable days and exercises
- Track workout sessions with sets, reps, and weights
- Browse an extensive exercise library (800+ exercises with images)
- View workout history and logs

The application uses a modern serverless architecture with **Next.js 16** for the frontend and **Convex** as a Backend-as-a-Service (BaaS) providing real-time database, serverless functions, and authentication.

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend Framework** | Next.js | 16.1.1 | React framework with App Router |
| **UI Library** | React | 19.2.3 | Component-based UI |
| **Language** | TypeScript | 5.9.3 | Type-safe JavaScript |
| **Backend** | Convex | 1.31.3 | Serverless BaaS (database, functions, real-time sync) |
| **Authentication** | @convex-dev/auth | 0.0.90 | Email/password auth via Convex |
| **Styling** | Tailwind CSS | 3.4.19 | Utility-first CSS framework |
| **UI Components** | Radix UI + shadcn/ui | various | Accessible component primitives |
| **Validation** | Zod | 4.1.12 | Runtime schema validation |
| **Drag & Drop** | @dnd-kit | 6.3.1 | Sortable lists and drag-drop |
| **Date Handling** | date-fns + dayjs | 4.1.0 / 1.11.19 | Date utilities |
| **Icons** | Lucide React | 0.562.0 | Icon library |
| **Package Manager** | pnpm | 10.27.0 | Fast, disk-efficient package manager |

## Architecture Pattern

### Full-Stack Serverless with Convex BaaS

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
├─────────────────────────────────────────────────────────────────┤
│  Next.js App Router                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Pages     │  │ Components  │  │  Providers  │             │
│  │  (app/)     │  │             │  │ (Convex,    │             │
│  │             │  │  - ui/      │  │  Theme)     │             │
│  │  /routines  │  │  - auth/    │  │             │             │
│  │  /exercises │  │  - sessions │  └─────────────┘             │
│  │  /logs      │  │  - routines │                              │
│  │  /day/[day] │  │  - workouts │                              │
│  └─────────────┘  └─────────────┘                              │
│           │              │                                      │
│           └──────┬───────┘                                      │
│                  │ useQuery / useMutation                       │
└──────────────────┼──────────────────────────────────────────────┘
                   │
                   │ WebSocket (real-time sync)
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CONVEX BACKEND (Self-Hosted)                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Queries   │  │  Mutations  │  │    Auth     │             │
│  │             │  │             │  │             │             │
│  │ - exercises │  │ - routines  │  │ - email/pwd │             │
│  │ - routines  │  │ - sessions  │  │ - JWT       │             │
│  │ - sessions  │  │ - sets      │  │             │             │
│  │ - profiles  │  │ - setGroups │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│           │              │              │                       │
│           └──────────────┴──────────────┘                       │
│                          │                                      │
│                          ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Convex Database                          ││
│  │  Tables: users, routines, routineDays, sessions,            ││
│  │          setGroups, sets, exercises, userProfiles           ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Backend** | Convex (self-hosted) | Real-time sync, TypeScript-native, serverless functions |
| **Routing** | Next.js App Router | File-based routing, React Server Components support |
| **State Management** | Convex reactive queries | No Redux needed - Convex provides real-time state |
| **Component Library** | shadcn/ui | Customizable, accessible, copy-paste components |
| **Auth Strategy** | Convex Auth (email/password) | Integrated with Convex, JWT-based |
| **Deployment** | Docker (self-hosted Convex) | Full control, local development parity |

## Data Architecture

### Database Schema (Convex)

The application uses Convex's document database with the following tables:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   users     │────<│  routines   │────<│ routineDays │
│             │     │             │     │             │
│ (Convex     │     │ name        │     │ name        │
│  managed)   │     │ userId      │     │ routineId   │
└─────────────┘     │ restSeconds │     │ order       │
      │             └─────────────┘     │ exercises[] │
      │                                 └─────────────┘
      │
      ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│userProfiles │     │  sessions   │────<│  setGroups  │
│             │     │             │     │             │
│ userId      │     │ userId      │     │ sessionId   │
│ weightUnit  │     │ routineId   │     │ exerciseId  │
│ repUnit     │     │ startTime   │     │ order       │
│ restSeconds │     │ endTime     │     │ restSeconds │
└─────────────┘     │ status      │     └──────┬──────┘
                    └─────────────┘            │
                                               ▼
┌─────────────┐                         ┌─────────────┐
│  exercises  │                         │    sets     │
│             │                         │             │
│ name        │                         │ setGroupId  │
│ muscles     │                         │ weight      │
│ equipment   │                         │ reps        │
│ images[]    │                         │ weightUnit  │
│ instructions│                         │ repUnit     │
└─────────────┘                         │ setType     │
                                        │ completed   │
                                        └─────────────┘
```

### Data Relationships

| Relationship | Type | Description |
|--------------|------|-------------|
| User → Routines | 1:N | User owns multiple routines |
| Routine → RoutineDays | 1:N | Routine has multiple days |
| User → Sessions | 1:N | User has multiple workout sessions |
| Session → SetGroups | 1:N | Session contains exercise groups |
| SetGroup → Sets | 1:N | Each exercise group has multiple sets |
| Exercise → SetGroups | 1:N | Exercise referenced by set groups |

## API Design (Convex Functions)

### Queries (Read Operations)

| Query | File | Purpose |
|-------|------|---------|
| `exercises.list` | `queries/exercises.ts` | List all exercises |
| `exercises.search` | `queries/exercises.ts` | Search exercises by name |
| `routines.list` | `queries/routines.ts` | List user's routines |
| `routines.get` | `queries/routines.ts` | Get routine with days |
| `sessions.list` | `queries/sessions.ts` | List user's workout sessions |
| `sessions.get` | `queries/sessions.ts` | Get session with sets |
| `userProfiles.get` | `queries/userProfiles.ts` | Get user preferences |

### Mutations (Write Operations)

| Mutation | File | Purpose |
|----------|------|---------|
| `routines.create/update/delete` | `mutations/routines.ts` | Routine CRUD |
| `routineDays.create/update/delete` | `mutations/routineDays.ts` | Routine day management |
| `sessions.start/end` | `mutations/sessions.ts` | Session lifecycle |
| `setGroups.create/reorder` | `mutations/setGroups.ts` | Exercise groups |
| `sets.create/update/delete` | `mutations/sets.ts` | Individual set tracking |
| `userProfiles.update` | `mutations/userProfiles.ts` | User preferences |

## Component Architecture

### Component Hierarchy

```
app/layout.tsx
└── Providers (Convex, Theme)
    └── AppWrapper
        ├── Header (navigation, account menu)
        └── Page Content
            ├── /routines → RoutineCard[], CreateRoutine
            ├── /exercises → ExerciseCard[], search
            ├── /logs → SessionSummaryCard[]
            ├── /logs/[session] → SessionPage, WorkoutList
            └── /day/[day] → CurrentSessionPage, RestTimer
```

### Component Categories

| Category | Components | Responsibility |
|----------|------------|----------------|
| **UI Primitives** | button, card, dialog, input, select | Base building blocks (shadcn/ui) |
| **Auth** | LoginForm, AuthGuard | Authentication flows |
| **Layout** | AppWrapper, Header, AccountNavItem | App shell and navigation |
| **Routines** | RoutineCard, CreateRoutine, RoutineDayItem | Routine management |
| **Sessions** | SessionPage, CurrentSessionPage, RestTimer | Active workout tracking |
| **WorkoutSet** | WorkoutList, WorkoutSetGroup, set editors | Set/rep data entry |
| **Exercises** | ExerciseCard, ExerciseDetailModal | Exercise library |

## Authentication Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  LoginForm  │───>│ Convex Auth │───>│   Convex    │
│             │    │             │    │  Database   │
│ email/pwd   │    │ JWT tokens  │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │  AuthGuard  │
                   │             │
                   │ Protected   │
                   │ routes      │
                   └─────────────┘
```

- **Strategy:** Email/password authentication via Convex Auth
- **Token Storage:** JWT tokens managed by Convex client
- **Route Protection:** `middleware.ts` + `AuthGuard` component
- **Protected Routes:** `/routines`, `/exercises`, `/logs`, `/day/*`

## Development Workflow

### Local Development

```bash
# 1. Start Convex backend (Docker)
docker compose up -d

# 2. Deploy Convex schema/functions
npx convex deploy

# 3. Start Next.js dev server
pnpm dev
```

### Key Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start Next.js development server |
| `pnpm build` | Build for production |
| `pnpm lint` | Run ESLint |
| `npx convex deploy` | Deploy Convex functions |
| `pnpm convex run seed:run` | Seed database |
| `docker compose up -d` | Start Convex backend |

## Deployment Architecture

### Docker Services (Self-Hosted)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Docker Compose                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐    ┌─────────────────────┐            │
│  │  convex-backend     │    │  convex-dashboard   │            │
│  │  :3210              │    │  :6791              │            │
│  │                     │    │                     │            │
│  │  - Database         │◄───│  - Admin UI         │            │
│  │  - Functions        │    │  - Data explorer    │            │
│  │  - Auth             │    │  - Logs             │            │
│  └─────────────────────┘    └─────────────────────┘            │
│            │                                                    │
│            ▼                                                    │
│  ┌─────────────────────┐                                       │
│  │  Volume: data       │                                       │
│  │  (persistent)       │                                       │
│  └─────────────────────┘                                       │
└─────────────────────────────────────────────────────────────────┘
```

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Convex backend URL (client) |
| `CONVEX_SELF_HOSTED_URL` | Convex backend URL (server) |
| `INSTANCE_NAME` | Convex instance identifier |
| `INSTANCE_SECRET` | Instance secret (32-byte hex) |
| `CONVEX_SELF_HOSTED_ADMIN_KEY` | Admin API key |
| `JWT_PRIVATE_KEY` | Auth signing key |
| `JWKS` | JSON Web Key Set |

## Testing Strategy

> Note: Test infrastructure not yet implemented in codebase.

**Recommended approach:**
- **Unit Tests:** Vitest for utility functions and components
- **Integration Tests:** Testing Library for component interactions
- **E2E Tests:** Playwright for critical user flows
- **API Tests:** Convex function unit tests

## Security Considerations

| Area | Implementation |
|------|----------------|
| **Authentication** | JWT-based via Convex Auth |
| **Authorization** | User-scoped queries/mutations |
| **Data Isolation** | All queries filter by `userId` |
| **Secrets** | Environment variables, not in code |
| **CORS** | Convex handles automatically |

## Performance Characteristics

| Feature | Approach |
|---------|----------|
| **Real-time Updates** | Convex WebSocket subscriptions |
| **Optimistic Updates** | Convex mutation optimistic responses |
| **Caching** | Convex client-side query cache |
| **Code Splitting** | Next.js automatic per-route splitting |
| **Image Optimization** | Next.js Image component |
| **Static Assets** | 800+ exercise images in `/public` |

## Future Considerations

- **Testing:** Add comprehensive test suite
- **CI/CD:** GitHub Actions for automated deployment
- **Monitoring:** Error tracking and performance monitoring
- **PWA:** Offline support for workout tracking
- **Mobile:** React Native or Capacitor wrapper
