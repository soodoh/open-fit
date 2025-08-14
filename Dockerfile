# Stage 1: Build Stage
FROM node:lts AS builder

RUN apt-get -qy update && apt-get -qy install openssl

# Set working directory
WORKDIR /app

# Copy package manager files
COPY package.json yarn.lock .yarnrc.yml  ./
COPY .yarn/ .yarn/

# Install dependencies
# RUN corepack enable
RUN yarn install --frozen-lockfile

# Copy the rest of the application files
COPY ./ ./

# Build the app in standalone mode
RUN npx prisma generate
RUN yarn build

# Stage 2: Runtime Stage
FROM node:18-slim AS runner

RUN apt-get -qy update && apt-get -qy install openssl

# Set working directory
WORKDIR /app

# Copy the standalone output and dependencies from the builder stage
COPY --from=builder /app/.next/standalone/ ./
COPY --from=builder /app/.next/static/ ./.next/static/
COPY --from=builder /app/public/ ./public/

# Set environment variable for production
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]

