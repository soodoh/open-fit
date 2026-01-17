# Data Models - open-fit

> Convex database schema for the fitness tracking application

## Overview

The database uses **Convex Document Database** with 14 tables organized into:
- **Auth Tables** (managed by @convex-dev/auth)
- **User Tables** (profiles, preferences)
- **Workout Tables** (routines, sessions, sets)
- **Exercise Tables** (library, metadata)
- **Reference Tables** (units, categories)

## Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   users     │────<│  routines   │────<│ routineDays │
│ (Convex     │     │             │     │             │
│  Auth)      │     │ name        │     │ weekdays[]  │
│             │     │ description │     │ description │
│             │     │ updatedAt   │     │ updatedAt   │
└─────────────┘     └─────────────┘     └──────┬──────┘
      │                                        │
      │                                        ▼
      │                                ┌─────────────┐
      ▼                                │setGroups    │
┌─────────────┐                        │ (template)  │
│userProfiles │     ┌─────────────┐    │ type        │
│             │     │  sessions   │───<│ order       │
│ role        │     │             │    │ comment     │
│ units       │     │ name        │    └──────┬──────┘
│ theme       │     │ notes       │           │
└─────────────┘     │ startTime   │           ▼
                    │ endTime     │    ┌─────────────┐
                    │ impression  │    │   sets      │
                    │ templateId  │    │             │
                    └─────────────┘    │ exerciseId  │
                           │           │ weight      │
                           ▼           │ reps        │
                    ┌─────────────┐    │ type        │
                    │setGroups    │    │ completed   │
                    │ (session)   │    └─────────────┘
                    │             │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐    ┌─────────────┐
                    │   sets      │───>│  exercises  │
                    │ (session)   │    │             │
                    └─────────────┘    │ name        │
                                       │ muscles[]   │
                                       │ equipment   │
                                       │ level       │
                                       │ images[]    │
                                       └─────────────┘
```

## Core Tables

### users (Convex Auth)

Managed by `@convex-dev/auth`. Contains authentication identities.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | `Id<"users">` | Auto-generated ID |
| `tokenIdentifier` | `string` | Auth token identifier |
| `email` | `string` | User email |
| `name` | `string?` | Display name |
| `image` | `string?` | Profile image URL |

### userProfiles

Extended user preferences linked to auth user.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | `Id<"userProfiles">` | Auto-generated ID |
| `userId` | `Id<"users">` | Reference to auth user |
| `role` | `"USER" \| "ADMIN"` | User role |
| `defaultRepetitionUnitId` | `Id<"repetitionUnits">` | Default rep unit |
| `defaultWeightUnitId` | `Id<"weightUnits">` | Default weight unit |
| `theme` | `"light" \| "dark" \| "system"` | Theme preference |

**Indexes:** `by_user` (userId)

### routines

Workout templates (e.g., "Push Pull Legs").

| Field | Type | Description |
|-------|------|-------------|
| `_id` | `Id<"routines">` | Auto-generated ID |
| `userId` | `Id<"users">` | Owner |
| `name` | `string` | Routine name |
| `description` | `string?` | Optional description |
| `updatedAt` | `number` | Last modified timestamp |

**Indexes:** `by_user`, `by_user_updated`
**Search:** `search_name` (name, filtered by userId)

### routineDays

Days within a routine (e.g., "Push Day").

| Field | Type | Description |
|-------|------|-------------|
| `_id` | `Id<"routineDays">` | Auto-generated ID |
| `routineId` | `Id<"routines">` | Parent routine |
| `userId` | `Id<"users">` | Owner |
| `weekdays` | `number[]` | Days of week (0=Sun, 6=Sat) |
| `description` | `string` | Day name/description |
| `updatedAt` | `number` | Last modified timestamp |

**Indexes:** `by_routine`, `by_user`
**Search:** `search_description` (description, filtered by userId)

### workoutSessions

Active or completed workout sessions.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | `Id<"workoutSessions">` | Auto-generated ID |
| `userId` | `Id<"users">` | Owner |
| `name` | `string` | Session name |
| `notes` | `string` | Workout notes |
| `impression` | `number?` | Rating (1-5) |
| `startTime` | `number` | Start timestamp |
| `endTime` | `number?` | End timestamp (null = active) |
| `templateId` | `Id<"routineDays">?` | Source template |

**Indexes:** `by_user`, `by_user_start`, `by_template`
**Search:** `search_name` (name, filtered by userId)

### workoutSetGroups

Groups of sets for an exercise within a session or template.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | `Id<"workoutSetGroups">` | Auto-generated ID |
| `userId` | `Id<"users">` | Owner |
| `routineDayId` | `Id<"routineDays">?` | Parent (if template) |
| `sessionId` | `Id<"workoutSessions">?` | Parent (if session) |
| `type` | `"NORMAL" \| "SUPERSET"` | Group type |
| `order` | `number` | Display order |
| `comment` | `string?` | Notes |
| `updatedAt` | `number` | Last modified timestamp |

**Indexes:** `by_routine_day`, `by_session`, `by_user`

### workoutSets

Individual sets within a group.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | `Id<"workoutSets">` | Auto-generated ID |
| `userId` | `Id<"users">` | Owner |
| `setGroupId` | `Id<"workoutSetGroups">` | Parent group |
| `exerciseId` | `Id<"exercises">` | Exercise performed |
| `type` | `SetTypeEnum` | NORMAL/WARMUP/DROPSET/FAILURE |
| `order` | `number` | Order within group |
| `reps` | `number` | Repetitions performed |
| `repetitionUnitId` | `Id<"repetitionUnits">` | Unit (reps/seconds/etc) |
| `weight` | `number` | Weight used |
| `weightUnitId` | `Id<"weightUnits">` | Unit (lb/kg) |
| `restTime` | `number` | Rest time in seconds |
| `completed` | `boolean` | Is set completed |
| `updatedAt` | `number` | Last modified timestamp |

**Indexes:** `by_set_group`, `by_exercise`, `by_user`

### exercises

Exercise library (800+ entries).

| Field | Type | Description |
|-------|------|-------------|
| `_id` | `Id<"exercises">` | Auto-generated ID |
| `name` | `string` | Exercise name |
| `equipmentId` | `Id<"equipment">?` | Required equipment |
| `force` | `"push" \| "pull" \| "static"?` | Force type |
| `level` | `"beginner" \| "intermediate" \| "expert"` | Difficulty |
| `mechanic` | `"compound" \| "isolation"?` | Movement type |
| `primaryMuscleIds` | `Id<"muscleGroups">[]` | Primary muscles |
| `secondaryMuscleIds` | `Id<"muscleGroups">[]` | Secondary muscles |
| `instructions` | `string[]` | Step-by-step instructions |
| `categoryId` | `Id<"categories">` | Exercise category |
| `images` | `string[]` | Image file paths |

**Indexes:** `by_name`, `by_category`, `by_equipment`
**Search:** `search_exercise` (name, filtered by equipmentId, level, categoryId)

## Reference Tables

### equipment

Exercise equipment types.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | `Id<"equipment">` | Auto-generated ID |
| `name` | `string` | Equipment name |

**Indexes:** `by_name`

### muscleGroups

Muscle group definitions.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | `Id<"muscleGroups">` | Auto-generated ID |
| `name` | `string` | Muscle group name |

**Indexes:** `by_name`

### categories

Exercise categories.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | `Id<"categories">` | Auto-generated ID |
| `name` | `string` | Category name |

**Indexes:** `by_name`

### repetitionUnits

Units for measuring repetitions.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | `Id<"repetitionUnits">` | Auto-generated ID |
| `name` | `string` | Unit name |

**Indexes:** `by_name`

**Seeded Values:** Repetitions, Seconds, Minutes, Miles, Kilometers

### weightUnits

Units for measuring weight.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | `Id<"weightUnits">` | Auto-generated ID |
| `name` | `string` | Unit name |

**Indexes:** `by_name`

**Seeded Values:** lb, kg, Body Weight

## Enum Types

```typescript
// Set group types
type SetGroupTypeEnum = "NORMAL" | "SUPERSET";

// Individual set types
type SetTypeEnum = "NORMAL" | "WARMUP" | "DROPSET" | "FAILURE";

// Exercise force types
type ExerciseForceEnum = "push" | "pull" | "static";

// Exercise difficulty levels
type ExerciseLevelEnum = "beginner" | "intermediate" | "expert";

// Exercise movement types
type ExerciseMechanicEnum = "compound" | "isolation";

// User role types
type RoleEnum = "USER" | "ADMIN";

// Theme options
type ThemeEnum = "light" | "dark" | "system";
```

## Key Relationships

| Parent | Child | Relationship | On Delete |
|--------|-------|--------------|-----------|
| `users` | `userProfiles` | 1:1 | Orphaned |
| `users` | `routines` | 1:N | Orphaned |
| `users` | `workoutSessions` | 1:N | Orphaned |
| `routines` | `routineDays` | 1:N | Cascade |
| `routineDays` | `workoutSetGroups` | 1:N | Cascade |
| `workoutSessions` | `workoutSetGroups` | 1:N | Cascade |
| `workoutSetGroups` | `workoutSets` | 1:N | Cascade |
| `exercises` | `workoutSets` | 1:N | Preserved |

## Schema Definition

```typescript
// convex/schema.ts
export default defineSchema({
  ...authTables, // Convex Auth tables

  userProfiles: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("USER"), v.literal("ADMIN")),
    defaultRepetitionUnitId: v.id("repetitionUnits"),
    defaultWeightUnitId: v.id("weightUnits"),
    theme: v.union(v.literal("light"), v.literal("dark"), v.literal("system")),
  }).index("by_user", ["userId"]),

  routines: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_updated", ["userId", "updatedAt"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["userId"],
    }),

  // ... (remaining tables follow same pattern)
});
```

---

*Generated: 2026-01-16 | Scan Level: Deep | Workflow: document-project v1.2.0*
