# syntax=docker.io/docker/dockerfile:1

FROM node:lts-alpine AS base

RUN apk upgrade --no-cache
RUN apk add --no-cache libc6-compat git

WORKDIR /app
COPY . .

RUN \
  corepack enable; \
  yarn --frozen-lockfile; \
  yarn build;

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

ENV NODE_ENV=production

# Set correct permissions for nextjs user and don't run as root
RUN addgroup nodejs
RUN adduser -SDH nextjs
RUN chown nextjs:nodejs .next

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "wget", "-q0", "http://localhost:3000/health" ]

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
# CMD ["node", "/app/.next/standalone/server.js"]
CMD ["tail", "-f", "/dev/null"]
