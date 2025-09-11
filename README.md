# Getting Started

## Setup your .env file

```bash
TZ=America/Los_Angeles
POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
DATABASE_URL="postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:5432/$POSTGRES_DB"

# Must match email address regex
# (Used for initial admin user during setup, this may change as the project matures)
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=adminadmin
```

Or alternatively, setup environment variables in your compose.yml

## Generate prisma client

```bash
npx prisma generate
```

## Spin up local services

See the `compose.yml` file for reference.

```bash
docker compose up -d
```

## Seed the database (if empty)

```bash
# Sync empty DB with current schema
npx prisma db push
# Run seed script, to fill DB with initial Exercises, etc.
npx prisma db seed
# Generate types from schema
npx prisma generate
```

## (Optional) fill DB with additional data for local development & testing

```bash
npx tsx prisma/testData.ts
```

## Run local dev server:

```bash
yarn dev
```

# Making changes to the database

```bash
# Update types, if any changed
npx prisma generate
# Apply the migration
npx prisma migrate dev --name {SOME_DESCRIPTIVE_NAME_FOR_CHANGES}
```

# Roadmap

## Planned

[] Dev experience
    [] Script to hydrate DB with dummy routines/days/etc for easier development
    [] Remove SWR, use React Query
    [] Remove Next server functions, use regular API endpoints
    [] Github Actions w/ changeset flow to release Docker images
        [] Github Actions to update documentation website
    [] Streamline initial dataset (remove assets and make script to initialize DB by pulling from a separate repo/source, similar to wger)?
        [] Use LLM to localize these exercises, instructions, etc.
        [] Host public website to sync exercises (similar to wger)?
    [] Documentation website
    [] Auto-generated API documentation (redocly? swagger?)
    [] Monorepo for mobile/web/documentation site?
[] Dark mode, retheme
[] PWA
    [] Add manifest, icons, metadata, etc.
    [] Use service workers
    [] Offline support & syncing
[] Home page
    [] Show recommended routines / templates (days)
    [] Show recent templates (or templates from recent routines)
    [] Show PRs, progress graphs from recent exercises
    [] Rename "Day" model to "Template", since I think this makes more sense for more use cases
[] Workout page
    [] Suggest alternate exercises based on muscle group
    [] Filter exercises based on available equipment (per current gym selected)
[] Admin page
    [] User management
    [] oauth / email + password authentication
    [] Add, edit Equipment, Muscle Groups, etc.
[] User Profile page
    [] Dark mode / other themes
    [] Choose default units (metric, imperial, etc.)
    [] Create gyms, assign available equipment per gym
[] Exercises page
    [] Admins can edit global exercises
    [] Users can add custom exercises
    [] Users can upload images for exercises
[] Metrics view per exercise
    [] View graphs of historical exercises
    [] Calculate 1 rep max & other relevant metrics
    [] Show correlated data from similar exercises
[] Globalization
    [] Integrate a localization library of some sort
    [] Use LLM to translate common strings
    [] Use LLM to translate "default set" of exercises, etc.

## Someday

[] Playwright testing for APIs & UI flows
    [] Run tests in Github Actions, auto fail releases, typical CI best practices, etc.
[] Nutrition planning feature, similar to wger?
[] Ability to scrape exercises/routines from other web pages
[] UI enhancements
[] PWA wrapper for iOS/Android that can import data from Apple Health/Health Connect
