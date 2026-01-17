# API Contracts - open-fit

> Convex queries and mutations for the fitness tracking application

## Overview

The API is implemented as Convex serverless functions, providing:
- **Real-time reactivity** - UI updates automatically when data changes
- **Type safety** - TypeScript types generated from schema
- **Authentication** - All endpoints require authenticated user

## Queries (Read Operations)

### Routines

| Query | File | Purpose |
|-------|------|---------|
| `routines.list` | `convex/queries/routines.ts` | List user's routines with pagination |
| `routines.get` | `convex/queries/routines.ts` | Get single routine with days |
| `routines.search` | `convex/queries/routines.ts` | Search routines by name |
| `routines.count` | `convex/queries/routines.ts` | Count user's routines |
| `routines.searchCount` | `convex/queries/routines.ts` | Count search results |

**Example Usage:**
```typescript
const routines = useQuery(api.queries.routines.list, {
  paginationOpts: { numItems: 10, cursor: null }
});
```

### Routine Days

| Query | File | Purpose |
|-------|------|---------|
| `routineDays.byRoutine` | `convex/queries/routineDays.ts` | Get days for a routine |
| `routineDays.get` | `convex/queries/routineDays.ts` | Get single routine day |

### Sessions (Workouts)

| Query | File | Purpose |
|-------|------|---------|
| `sessions.list` | `convex/queries/sessions.ts` | List all user sessions |
| `sessions.listPaginated` | `convex/queries/sessions.ts` | Paginated session list |
| `sessions.get` | `convex/queries/sessions.ts` | Get session with sets |
| `sessions.getCurrent` | `convex/queries/sessions.ts` | Get active session (no endTime) |
| `sessions.search` | `convex/queries/sessions.ts` | Search sessions by name |
| `sessions.count` | `convex/queries/sessions.ts` | Count user sessions |

**Example Usage:**
```typescript
const currentSession = useQuery(api.queries.sessions.getCurrent);
```

### Exercises

| Query | File | Purpose |
|-------|------|---------|
| `exercises.list` | `convex/queries/exercises.ts` | List all exercises |
| `exercises.listPaginated` | `convex/queries/exercises.ts` | Paginated exercise list |
| `exercises.get` | `convex/queries/exercises.ts` | Get single exercise |
| `exercises.search` | `convex/queries/exercises.ts` | Search by name |
| `exercises.byCategory` | `convex/queries/exercises.ts` | Filter by category |
| `exercises.byEquipment` | `convex/queries/exercises.ts` | Filter by equipment |
| `exercises.byMuscle` | `convex/queries/exercises.ts` | Filter by muscle group |

### Reference Data

| Query | File | Purpose |
|-------|------|---------|
| `lookups.all` | `convex/queries/lookups.ts` | Get all reference data |
| `units.list` | `convex/queries/units.ts` | List weight/rep units |
| `userProfiles.get` | `convex/queries/userProfiles.ts` | Get user preferences |

## Mutations (Write Operations)

### Routines

| Mutation | File | Purpose |
|----------|------|---------|
| `routines.create` | `convex/mutations/routines.ts` | Create new routine |
| `routines.update` | `convex/mutations/routines.ts` | Update routine |
| `routines.remove` | `convex/mutations/routines.ts` | Delete routine (cascade) |

**Example Usage:**
```typescript
const createRoutine = useMutation(api.mutations.routines.create);
await createRoutine({ name: "Push Day", description: "Chest and triceps" });
```

### Routine Days

| Mutation | File | Purpose |
|----------|------|---------|
| `routineDays.create` | `convex/mutations/routineDays.ts` | Create day in routine |
| `routineDays.update` | `convex/mutations/routineDays.ts` | Update day |
| `routineDays.remove` | `convex/mutations/routineDays.ts` | Delete day (cascade) |

### Sessions

| Mutation | File | Purpose |
|----------|------|---------|
| `sessions.create` | `convex/mutations/sessions.ts` | Start session (optionally from template) |
| `sessions.update` | `convex/mutations/sessions.ts` | Update session (name, notes, times) |
| `sessions.remove` | `convex/mutations/sessions.ts` | Delete session (cascade) |

**Template Cloning:**
When creating a session with `templateId`, the mutation:
1. Clones all set groups from the template
2. Clones all sets within each group
3. Sets `completed: false` on all new sets

### Set Groups

| Mutation | File | Purpose |
|----------|------|---------|
| `setGroups.create` | `convex/mutations/setGroups.ts` | Create exercise group |
| `setGroups.update` | `convex/mutations/setGroups.ts` | Update group (type, comment) |
| `setGroups.remove` | `convex/mutations/setGroups.ts` | Delete group (cascade sets) |
| `setGroups.reorder` | `convex/mutations/setGroups.ts` | Reorder groups |

### Sets

| Mutation | File | Purpose |
|----------|------|---------|
| `sets.create` | `convex/mutations/sets.ts` | Create individual set |
| `sets.update` | `convex/mutations/sets.ts` | Update set (weight, reps, type) |
| `sets.remove` | `convex/mutations/sets.ts` | Delete set |
| `sets.toggleComplete` | `convex/mutations/sets.ts` | Mark set complete/incomplete |
| `sets.bulkUpdate` | `convex/mutations/sets.ts` | Update multiple sets |

### User Profiles

| Mutation | File | Purpose |
|----------|------|---------|
| `userProfiles.createForNewUser` | `convex/mutations/userProfiles.ts` | Create profile on signup |
| `userProfiles.update` | `convex/mutations/userProfiles.ts` | Update preferences |

## Authentication Pattern

All queries and mutations use the helper function:

```typescript
// convex/lib/auth.ts
export async function getAuthenticatedUserId(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  // Return the user ID from the users table
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .unique();
  if (!user) {
    throw new Error("User not found");
  }
  return user._id;
}
```

## Authorization Pattern

All data is user-scoped. Every query filters by `userId`:

```typescript
// Example from routines.ts
const routines = await ctx.db
  .query("routines")
  .withIndex("by_user", (q) => q.eq("userId", userId))
  .collect();
```

All mutations verify ownership before modifying:

```typescript
// Example from routines.ts
const routine = await ctx.db.get(args.id);
if (routine.userId !== userId) {
  throw new Error("Unauthorized");
}
```

## Cascade Delete Pattern

When deleting parent entities, children are deleted automatically:

- **Routine** → RoutineDays → SetGroups → Sets
- **Session** → SetGroups → Sets
- **RoutineDay** → SetGroups → Sets
- **SetGroup** → Sets

## Pagination

Paginated queries use Convex's built-in pagination:

```typescript
export const list = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("routines")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .paginate(args.paginationOpts);
  },
});
```

**Client Usage:**
```typescript
const { results, status, loadMore } = usePaginatedQuery(
  api.queries.routines.list,
  {},
  { initialNumItems: 10 }
);
```

## Search Indexes

Full-text search is enabled for:

| Table | Index | Search Field | Filter Fields |
|-------|-------|--------------|---------------|
| `routines` | `search_name` | name | userId |
| `routineDays` | `search_description` | description | userId |
| `workoutSessions` | `search_name` | name | userId |
| `exercises` | `search_exercise` | name | equipmentId, level, categoryId |

---

*Generated: 2026-01-16 | Scan Level: Deep | Workflow: document-project v1.2.0*
