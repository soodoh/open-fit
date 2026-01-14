# Stage 1: Build Stage
FROM node:lts

RUN apt-get -qy update && apt-get -qy install openssl

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy all the application files
COPY ./ ./

# Install dependencies
RUN pnpm install

# Build the app in standalone mode
RUN pnpm build

# Set environment variable for production
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", ".next/standalone/server.js"]

