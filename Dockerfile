# ---- Base Stage ----
FROM node:23-alpine AS base
WORKDIR /usr/src/app
# Install OS dependencies potentially needed by Prisma at runtime or build
RUN apk add --no-cache openssl

# ---- Dependencies Stage ----
# Install only production dependencies
FROM base AS dependencies
COPY package.json package-lock.json* ./
# Install production dependencies using npm ci for consistency and speed
# NODE_ENV=production is implicitly used by `npm ci --only=production`
RUN npm ci --only=production --ignore-scripts
# If you have critical production postinstall scripts, remove --ignore-scripts

# ---- Builder Stage ----
# Build the application using all dependencies (including dev)
FROM base AS builder
# Copy package.json and package-lock.json again
COPY package.json package-lock.json* ./
# Install ALL dependencies (including devDependencies)
RUN npm ci --ignore-scripts
# Copy the rest of the application source code
COPY . .

# Generate Prisma Client - needs schema, potentially dev dependencies
# Ensure schema.prisma includes binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
# Note: Prisma generate usually doesn't NEED DATABASE_URL, it works off the schema file.
# If your setup requires it, consider BuildKit secrets or a non-sensitive build-time ARG.
RUN npx prisma generate

# Build the NestJS application
RUN npm run build


# ---- Production Stage ----
# Create the final, lean production image
FROM node:23-alpine AS production
WORKDIR /usr/src/app

# Set NODE_ENV to production (this one is safe and standard)
ENV NODE_ENV=production

# Install runtime OS dependencies (e.g., openssl for Prisma runtime)
RUN apk add --no-cache openssl curl

# Copy production node_modules from the dependencies stage
COPY --chown=node:node --from=dependencies /usr/src/app/node_modules ./node_modules

# Copy built application from the builder stage
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

# Copy Prisma schema and migrations for runtime use (e.g., `prisma migrate deploy`)
COPY --chown=node:node --from=builder /usr/src/app/prisma ./prisma

# Copy package.json (needed sometimes by libraries or for identification)
COPY --chown=node:node --from=builder /usr/src/app/package.json ./package.json

# *** NO ARG or ENV declarations for sensitive runtime variables here ***
# *** NO COPY .env line here ***

# Switch to a non-root user for security
USER node

# Expose the port the application runs on (default 3000 for NestJS)
EXPOSE 3000

# Define the command to run the application
# The application will read environment variables provided at RUNTIME
# Optionally run migrations before starting:
# CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
CMD ["node", "dist/main.js"]

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl --fail http://localhost:3000 || exit 1