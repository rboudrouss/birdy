FROM node:20.10 AS base

ARG NODE_ENV="production"
ARG MAIN_URL="http://localhost:3000"
ARG PORT=3000

ENV NODE_ENV=${NODE_ENV}
ENV MAIN_URL=${MAIN_URL}
ENV PORT=${PORT}



# Install dependencies only when needed
FROM base AS deps

RUN ln -snf /usr/share/zoneinfo/Europe/Paris /etc/localtime && echo "Europe/Paris" > /etc/timezone
ENV TZ="Europe/Paris"

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm install --cpu=x64 --os=linux --libc=glibc sharp
RUN npm i

FROM base AS dev

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Uncomment this if you're using prisma, generates prisma files for linting
RUN npx prisma generate

#Enables Hot Reloading Check https://github.com/vercel/next.js/issues/36774 for more information
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /root/.npm /root/.npm
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Uncomment this if you're using prisma, generates prisma files for linting
RUN npx prisma generate

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next

VOLUME [ "/app/prisma" ]


# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Uncomment this if you're using prisma, copies prisma files for linting
COPY --from=builder /app/prisma ./prisma

USER root

EXPOSE ${PORT}

ENV PORT=${PORT}
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["npm", "run", "start:prod"]