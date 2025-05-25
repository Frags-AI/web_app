# syntax=docker/dockerfile:1

FROM node:23 AS base

# Set working directory for all build stages.
WORKDIR /usr/src/app

FROM base AS deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

FROM deps AS build

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npx prisma migrate deploy && npx prisma generate

RUN npm run build

FROM base AS final

ENV NODE_ENV=production

USER root
RUN apt-get update && \
    apt-get install -y ffmpeg curl && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json ./

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/src/clients/prisma ./dist/clients/prisma
COPY --from=build /usr/src/app/static ./static

EXPOSE 3000

CMD ["npm", "run", "start"]
