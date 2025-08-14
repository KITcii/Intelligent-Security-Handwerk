# Default build arguments
ARG APP_CODE_PATH_HOST="src"

################
## BASE STAGE ##
################
FROM node:23-alpine AS base

########################
## DEPENDENCIES STAGE ##
########################
# Install dependencies only when needed
FROM base AS deps
ARG APP_CODE_PATH_HOST

# Latest npm version regardless of node version
RUN npm i npm@latest -g

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat openssl3

WORKDIR /app

# Install dependencies
COPY ${APP_CODE_PATH_HOST}/package.json ${APP_CODE_PATH_HOST}/package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

#######################
## DEVELOPMENT STAGE ##
#######################
# Required for hot reload
FROM base AS dev
ARG APP_CODE_PATH_HOST
ARG SERVICE_DIR=".docker/node"

COPY ${SERVICE_DIR}/scripts/healthcheck.js /

# Latest npm version regardless of node version
RUN npm i npm@latest -g

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ${APP_CODE_PATH_HOST}/. .

#################
## BUILD STAGE ##
#################
# Rebuild the source code only when needed
FROM base AS builder
ARG APP_CODE_PATH_HOST

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ${APP_CODE_PATH_HOST}/. .

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

##################
## RUNNER STAGE ##
##################
# Production image, copy all the files and run next
FROM base AS runner

ARG SERVICE_DIR=".docker/node"

WORKDIR /app

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Custom entrypoint script for converting secrets to env vars
COPY ${SERVICE_DIR}/scripts/custom-entrypoint /

# Healthcheck
COPY ${SERVICE_DIR}/scripts/healthcheck.js /
HEALTHCHECK --interval=60s --timeout=2s --start-period=15s \  
    CMD node /healthcheck.js

EXPOSE 3000

# Run custom entrypoint script before running the original entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh", "docker-entrypoint.sh"]

CMD ["node", "server.js"]
