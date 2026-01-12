# Development Guide - open-fit

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 18+ | Check with `node -v` |
| pnpm | 10.27.0 | Package manager |
| Docker | Latest | For Convex backend |
| Convex Account | - | Free tier available at convex.dev |

## Initial Setup

### 1. Clone and Install

```bash
git clone https://github.com/soodoh/open-fit.git
cd open-fit
pnpm install
```

### 2. Environment Configuration

Create `.env.local` in project root:

```env
NEXT_PUBLIC_CONVEX_URL='http://localhost:3210'
CONVEX_SELF_HOSTED_URL='http://localhost:3210'
INSTANCE_NAME='convex-self-hosted'
INSTANCE_SECRET='<generate with: openssl rand -hex 32>'
CONVEX_SELF_HOSTED_ADMIN_KEY='<will update after Docker starts>'
```

### 3. Start Convex Backend (Docker)

```bash
docker compose up -d
```

This starts:
- **convex-backend** on port 3210 (database + functions)
- **convex-dashboard** on port 6791 (admin UI)

### 4. Get Admin Key

```bash
# Enter the container
docker exec -it open-fit-convex-backend-1 bash

# Generate admin key
./generate_admin_key.sh
```

Copy the output to `CONVEX_SELF_HOSTED_ADMIN_KEY` in `.env.local`.

### 5. Deploy Convex Schema & Functions

```bash
npx convex deploy
```

### 6. Generate Auth Keys

```bash
node ./scripts/generateKeys.mjs
```

Set the environment variables in Convex:

```bash
npx convex env set -- JWT_PRIVATE_KEY "<paste from output>"
npx convex env set -- JWKS "<paste from output>"
```

### 7. Seed the Database

```bash
pnpm convex run seed:run
```

This creates:
- 400+ exercises with muscle groups and images
- Weight units (lb, kg, Body Weight)
- Rep units (Repetitions, Seconds, Minutes, Miles, Kilometers)

### 8. Start Development Server

```bash
pnpm dev
```

Open http://localhost:3000 and create an account.

### 9. (Optional) Seed Test Data

After registration:

```bash
pnpm convex run seed:mockUserData '{"email": "your@email.com"}'
```

## Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js dev server (port 3000) |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Auto-fix ESLint issues |

## Convex Commands

| Command | Description |
|---------|-------------|
| `npx convex deploy` | Deploy schema and functions |
| `npx convex dev` | Watch mode (auto-deploy on changes) |
| `npx convex env set KEY VALUE` | Set environment variable |
| `pnpm convex run seed:run` | Seed exercises and units |
| `pnpm convex run seed:mockUserData '{"email":"..."}` | Seed test data |

## Docker Commands

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start Convex containers |
| `docker compose down` | Stop containers |
| `docker compose logs -f` | View container logs |
| `docker exec -it open-fit-convex-backend-1 bash` | Shell into backend |

## Project Structure

```
open-fit/
├── app/                    # Next.js pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   └── [route]/page.tsx   # Route pages
├── components/            # React components
│   ├── ui/               # shadcn/ui primitives
│   └── [domain]/         # Domain-specific components
├── convex/               # Convex backend
│   ├── schema.ts         # Database schema
│   ├── queries/          # Read operations
│   └── mutations/        # Write operations
├── lib/                  # Utilities
└── public/               # Static assets
```

## Code Conventions

### TypeScript
- Strict mode enabled
- Path alias: `@/*` maps to project root
- Use explicit types for function parameters

### Components
- Use shadcn/ui patterns for UI primitives
- Domain components in dedicated folders
- Props interfaces defined inline or in component file

### Convex
- Queries in `convex/queries/`
- Mutations in `convex/mutations/`
- Always validate user ownership in queries/mutations
- Use Zod for input validation

### Styling
- Tailwind CSS utilities
- CSS variables for theme colors (defined in `globals.css`)
- Use `cn()` utility for conditional classes

## Common Tasks

### Add a New Page

1. Create `app/[route]/page.tsx`
2. Add route to middleware if protected
3. Add navigation link to Header

### Add a New Component

1. Create file in appropriate `components/[domain]/` folder
2. Export from the file
3. Import where needed using `@/components/...`

### Add a Convex Query

```typescript
// convex/queries/example.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    return await ctx.db
      .query("tableName")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();
  },
});
```

### Add a Convex Mutation

```typescript
// convex/mutations/example.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    return await ctx.db.insert("tableName", {
      name: args.name,
      userId: identity.subject,
    });
  },
});
```

## Troubleshooting

### Convex connection issues
- Ensure Docker containers are running: `docker ps`
- Check `NEXT_PUBLIC_CONVEX_URL` matches port 3210
- Verify admin key is set correctly

### Auth not working
- Ensure JWT_PRIVATE_KEY and JWKS are set in Convex env
- Run `npx convex env list` to verify
- Redeploy functions: `npx convex deploy`

### Database empty after seeding
- Check seed output for errors
- Verify you're connected to correct Convex instance
- Re-run: `pnpm convex run seed:run`

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Convex backend URL (client-side) |
| `CONVEX_SELF_HOSTED_URL` | Yes | Convex backend URL (server-side) |
| `INSTANCE_NAME` | Yes | Convex instance identifier |
| `INSTANCE_SECRET` | Yes | Instance secret (32-byte hex) |
| `CONVEX_SELF_HOSTED_ADMIN_KEY` | Yes | Admin API key from container |
| `JWT_PRIVATE_KEY` | Yes* | Auth signing key (Convex env) |
| `JWKS` | Yes* | JSON Web Key Set (Convex env) |

*Set via `npx convex env set`, not in `.env.local`
