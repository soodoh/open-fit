# Source Tree Analysis - open-fit

> Fitness tracking web application built with Next.js 16 and Convex

## Directory Structure

```
open-fit/
├── app/                          # Next.js App Router (pages & layouts)
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home/dashboard page
│   ├── globals.css              # Global styles & CSS variables
│   ├── day/
│   │   └── [day]/page.tsx       # Daily workout view (dynamic route)
│   ├── exercises/
│   │   └── page.tsx             # Exercise library page
│   ├── logs/
│   │   ├── page.tsx             # Workout session logs list
│   │   └── [session]/page.tsx   # Individual session details (dynamic)
│   ├── register/
│   │   └── page.tsx             # User registration
│   ├── routines/
│   │   └── page.tsx             # Workout routines management
│   └── signin/
│       └── page.tsx             # User sign in
│
├── components/                   # React components
│   ├── ui/                      # shadcn/ui primitives (23 components)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── calendar.tsx
│   │   ├── date-time-picker.tsx
│   │   ├── duration-input.tsx
│   │   ├── progress-circle.tsx
│   │   └── ... (14 more)
│   ├── auth/                    # Authentication components
│   │   ├── AuthGuard.tsx        # Route protection wrapper
│   │   └── LoginForm.tsx        # Sign in/register form
│   ├── layout/                  # Layout components
│   │   ├── AppWrapper.tsx       # Main app shell
│   │   ├── Header.tsx           # Top navigation bar
│   │   └── AccountNavItem.tsx   # User account menu
│   ├── providers/               # React context providers
│   │   ├── ConvexClientProvider.tsx  # Convex client setup
│   │   ├── ThemeProvider.tsx    # Dark/light theme
│   │   └── ThemeSync.tsx        # Theme persistence
│   ├── exercises/               # Exercise-related components
│   │   ├── AutocompleteExercise.tsx
│   │   ├── ExerciseCard.tsx
│   │   └── ExerciseDetailModal.tsx
│   ├── routines/                # Routine management (10 components)
│   │   ├── CreateRoutine.tsx
│   │   ├── RoutineCard.tsx
│   │   ├── RoutineDayItem.tsx
│   │   ├── AddExerciseRow.tsx
│   │   ├── EditRoutineModal.tsx
│   │   ├── EditDayModal.tsx
│   │   ├── DeleteRoutineModal.tsx
│   │   ├── DeleteDayModal.tsx
│   │   ├── DeleteSetGroupModal.tsx
│   │   └── ... (menus)
│   ├── sessions/                # Workout session components (12 components)
│   │   ├── CreateSession.tsx
│   │   ├── CurrentSessionPage.tsx
│   │   ├── SessionPage.tsx
│   │   ├── SessionSummaryCard.tsx
│   │   ├── RestTimer.tsx
│   │   ├── CurrentDuration.tsx
│   │   ├── SelectTemplate.tsx
│   │   ├── ResumeSessionButton.tsx
│   │   └── ... (modals & menus)
│   ├── workoutSet/              # Set/rep tracking components (8 components)
│   │   ├── WorkoutList.tsx
│   │   ├── WorkoutSetGroup.tsx
│   │   ├── BulkEditSetModal.tsx
│   │   ├── EditSetCommentModal.tsx
│   │   ├── RepUnitMenu.tsx
│   │   ├── WeightUnitMenu.tsx
│   │   ├── SetTypeMenu.tsx
│   │   └── EditSetGroupMenu.tsx
│   └── profile/
│       └── ProfileModal.tsx     # User profile settings
│
├── convex/                       # Convex backend (serverless BaaS)
│   ├── schema.ts                # Database schema definition
│   ├── auth.ts                  # Auth configuration
│   ├── auth.config.ts           # Auth providers setup
│   ├── http.ts                  # HTTP routes for auth callbacks
│   ├── seed.ts                  # Database seeding script
│   ├── _generated/              # Auto-generated Convex types
│   │   ├── api.d.ts
│   │   ├── dataModel.d.ts
│   │   └── server.d.ts
│   ├── lib/
│   │   └── auth.ts              # Auth helper utilities
│   ├── mutations/               # Write operations (6 files)
│   │   ├── routines.ts          # CRUD for routines
│   │   ├── routineDays.ts       # CRUD for routine days
│   │   ├── sessions.ts          # Workout session management
│   │   ├── sets.ts              # Individual set tracking
│   │   ├── setGroups.ts         # Exercise groups within sessions
│   │   └── userProfiles.ts      # User profile management
│   ├── queries/                 # Read operations (6 files)
│   │   ├── exercises.ts         # Exercise library queries
│   │   ├── routines.ts          # Routine queries
│   │   ├── routineDays.ts       # Routine day queries
│   │   ├── sessions.ts          # Session history queries
│   │   ├── userProfiles.ts      # User data queries
│   │   └── units.ts             # Weight/rep unit queries
│   └── seedData/
│       └── exercises.ts         # Exercise seed data
│
├── lib/                          # Shared utilities
│   ├── utils.ts                 # General utilities (cn, etc.)
│   ├── convex-types.ts          # Convex type helpers
│   └── authSchema.ts            # Auth validation schemas
│
├── public/                       # Static assets
│   ├── favicon.png
│   ├── logo-bg-white.png
│   └── exercises/               # Exercise images & metadata
│       └── [Exercise_Name]/     # ~800+ exercises with images
│           ├── 0.jpg
│           ├── 1.jpg
│           └── [name].json
│
├── scripts/
│   └── generateKeys.mjs         # Key generation utility
│
├── middleware.ts                 # Next.js middleware (auth routes)
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies & scripts
├── compose.yml                  # Docker Compose (dev)
├── prod-compose.yml             # Docker Compose (prod)
├── Dockerfile                   # Container definition
└── README.md                    # Project documentation
```

## Critical Directories

| Directory | Purpose | Key Files |
|-----------|---------|-----------|
| `app/` | Next.js pages & routing | `layout.tsx` (entry), route `page.tsx` files |
| `components/` | React UI components | Domain-specific folders + `ui/` primitives |
| `convex/` | Backend logic & data | `schema.ts`, `mutations/`, `queries/` |
| `lib/` | Shared utilities | `utils.ts`, type helpers |
| `public/exercises/` | Exercise library assets | 800+ exercise images & JSON metadata |

## Entry Points

| Entry Point | File | Purpose |
|-------------|------|---------|
| **App Entry** | `app/layout.tsx` | Root layout, providers, global styles |
| **Home Page** | `app/page.tsx` | Dashboard/landing |
| **Middleware** | `middleware.ts` | Auth route protection |
| **Convex Schema** | `convex/schema.ts` | Database schema definition |
| **Auth Config** | `convex/auth.config.ts` | Authentication setup |

## Component Categories

| Category | Count | Purpose |
|----------|-------|---------|
| **UI Primitives** | 23 | shadcn/ui base components |
| **Sessions** | 12 | Workout session tracking |
| **Routines** | 10 | Routine/template management |
| **Workout Sets** | 8 | Set/rep data entry |
| **Exercises** | 3 | Exercise library display |
| **Layout** | 3 | App shell & navigation |
| **Auth** | 2 | Authentication flows |
| **Providers** | 3 | Context providers |
| **Profile** | 1 | User settings |

## Data Flow

```
User Action (UI)
    │
    ▼
React Component (components/)
    │
    ▼
Convex Hook (useQuery/useMutation)
    │
    ▼
Convex Backend (convex/)
    ├── queries/ (read)
    └── mutations/ (write)
           │
           ▼
    Convex Database (schema.ts)
```

## File Counts by Type

| Extension | Count | Location |
|-----------|-------|----------|
| `.tsx` | ~70 | `app/`, `components/` |
| `.ts` | ~25 | `convex/`, `lib/` |
| `.json` | 800+ | `public/exercises/` |
| `.jpg` | 1600+ | `public/exercises/` |
| Config files | 10 | Root directory |
