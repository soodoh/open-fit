# Open Fit

A fitness tracking application built with Next.js and Convex.

## Self host with Docker

Use the `prod-compose.yml` file as an example setup.

### 1. Build the Docker image

(Once this repo automates a Docker release pipeline, feel free to skip this step and use the `ghcr.io/soodoh/open-fit@latest` image directly).

```sh
docker build -t open-fit .
```

### 2. Setup your environment variables

Copy these generated keys into your Docker compose file's environment section, or your own `.env` file (and add an `env_file: .env` to the compose section). It should return values for `JWT_SECRET_KEY`, `JWKS`, and `INSTANCE_SECRET`.

```sh
docker run --rm open-fit pnpm generate:keys
```

With the `INSTANCE_SECRET` key from the previous command, run the following and add the result to your environment variables. It should return a value for `CONVEX_SELF_HOSTED_ADMIN_KEY`.

```sh
docker run --rm -e INSTANCE_SECRET="copy from" --entrypoint ./generate_admin_key.sh ghcr.io/get-convex/convex-backend:latest
```

### 3. Run docker compose

```sh
docker compose -f prod-compose.yml up -d
```

### 4. Init the database

This step may go away once I can figure out how to automate running on startup if the database is not already initialized.
Note that I'm assuming your container name is `open-fit-openfit-1`. Double check your image name with `docker ps`.

```sh
docker exec open-fit-openfit-1 pnpm init
```

## Getting Started (Developers)

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) package manager
- A [Convex](https://convex.dev/) account (free tier available)

### 1. Clone and Install Dependencies

```sh
git clone https://github.com/soodoh/open-fit.git
cd open-fit
pnpm install
```

### 2. Create your .env.local

```env
NEXT_PUBLIC_CONVEX_URL='http://localhost:3210'
CONVEX_SELF_HOSTED_URL='http://localhost:3210'
INSTANCE_NAME='convex-self-hosted'

# TODO in later steps
CONVEX_SELF_HOSTED_ADMIN_KEY='...'
```

Run `pnpm generate:keys` and paste these into your `.env.local`. Should be something like:
```env
JWT_PRIVATE_KEY="..."
JWKS="..."
INSTANCE_SECRET="..."
```

### 3. Run Convex backend in Docker

Spin up a local docker instance for Convex backend & dashboard. The `compose.yml` file included in this repo should take care of everything for you.

```sh
docker compose up -d
```

### 4. Update CONVEX_SELF_HOSTED_ADMIN_KEY

Run the following command to obtain an admin key for your Convex backend container. Note that this command will return a new key every time. But as long as the `INSTANCE_SECRET` env variable is consistent, any admin keys generated in the future will still work.

```sh
docker run --rm -e INSTANCE_SECRET="copy from earlier step" --entrypoint ./generate_admin_key.sh ghcr.io/get-convex/convex-backend:latest
```

Paste the output in your `.env.local` as the value for `CONVEX_SELF_HOSTED_ADMIN_KEY`.

### 5. Run init script

Run the follow script to run various commands to setup the new Convex backend. Ensure you completed the previous steps to configure your environment variables correctly.

```sh
JWT_PRIVATE_KEY="paste here" JWKS="paste here" INSTANCE_SECRET="paste here" pnpm init
```

### 6. Run the Development Server

```sh
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and create an account to get started.

### 7. (Optional) Seed Mock Data for Testing

After creating an account, you can seed test data (50 routines with days and sets):

```sh
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

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Convex (real-time database and serverless functions)
- **Authentication**: Convex Auth with email/password
- **Styling**: Tailwind CSS, shadcn/ui components
- **Drag & Drop**: dnd-kit
