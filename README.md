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
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=adminadmin
```

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
