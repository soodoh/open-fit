# Open Fit

A fitness tracking application built with Next.js and Convex.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) package manager
- A [Convex](https://convex.dev/) account (free tier available)

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/your-username/open-fit.git
cd open-fit
pnpm install
```

### 2. Set Up Convex

Create a Convex project and link it to your local codebase:

```bash
npx convex dev
```

This will:
- Prompt you to log in to Convex (or create an account)
- Create a new Convex project
- Generate a `.env.local` file with your `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`

Keep this terminal running - it syncs your Convex functions as you develop.

### 3. Configure Authentication

In a new terminal, run the Convex Auth setup command:

```bash
npx @convex-dev/auth
```

This interactive wizard will:
- Generate JWT keys (`JWT_PRIVATE_KEY` and `JWKS`)
- Set the required environment variables in your Convex deployment

Follow the prompts to complete the setup. You can skip configuring OAuth providers if you only want email/password authentication.

### 4. Seed the Database

Seed the database with exercises and units:

```bash
pnpm convex run seed:run
```

This creates:
- 400+ exercises with muscle groups, equipment, and instructions
- Repetition units (Repetitions, Seconds, Minutes, Miles, Kilometers)
- Weight units (lb, kg, Body Weight)

### 5. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and create an account to get started.

### 6. (Optional) Seed Mock Data for Testing

After creating an account, you can seed test data (50 routines with days and sets):

```bash
pnpm convex run seed:mockUserData '{"email": "your@email.com"}'
```

Replace `your@email.com` with the email you registered with.

## Project Structure

```
├── app/                    # Next.js app router pages
├── components/             # React components
│   ├── auth/              # Authentication components
│   ├── exercises/         # Exercise-related components
│   ├── routines/          # Routine management components
│   ├── sessions/          # Workout session components
│   ├── ui/                # Shared UI components
│   └── workoutSet/        # Workout set components
├── convex/                 # Convex backend
│   ├── mutations/         # Data mutation functions
│   ├── queries/           # Data query functions
│   ├── schema.ts          # Database schema
│   └── seed.ts            # Database seeding
├── lib/                    # Utility functions and types
└── public/                 # Static assets
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Convex (real-time database and serverless functions)
- **Authentication**: Convex Auth with email/password
- **Styling**: Tailwind CSS, shadcn/ui components
- **Drag & Drop**: dnd-kit

---

# Roadmap

## Planned

- [ ] Dev experience
    - [ ] GitHub Actions w/ changeset flow
    - [ ] Documentation website
    - [ ] Auto-generated API documentation
- [ ] Dark mode, retheme
- [ ] PWA
    - [ ] Add manifest, icons, metadata
    - [ ] Use service workers
    - [ ] Offline support & syncing
- [ ] Home page
    - [ ] Show recommended routines / templates
    - [ ] Show recent templates
    - [ ] Show PRs, progress graphs
- [ ] Workout page
    - [ ] Suggest alternate exercises based on muscle group
    - [ ] Filter exercises based on available equipment
- [ ] User Profile page
    - [ ] Dark mode / other themes
    - [ ] Choose default units (metric, imperial)
    - [ ] Create gyms, assign available equipment
- [ ] Exercises page
    - [ ] Users can add custom exercises
    - [ ] Users can upload images for exercises
- [ ] Metrics view per exercise
    - [ ] View graphs of historical exercises
    - [ ] Calculate 1 rep max & other metrics
- [ ] Globalization / localization

## Someday

- [ ] Playwright testing for UI flows
- [ ] Nutrition planning feature
- [ ] PWA wrapper for iOS/Android with Apple Health/Health Connect integration
