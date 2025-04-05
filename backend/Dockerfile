# syntax=docker/dockerfile:1



ARG NODE_VERSION=22.13.1


FROM node:${NODE_VERSION}-alpine AS base

# Set working directory for all build stages.
WORKDIR /usr/src/app

FROM base AS deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

FROM deps AS build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npx prisma generate

# Don't forget to migrate the schema to the database

RUN npm run build

FROM base AS final

ENV NODE_ENV=production

USER node

COPY package.json .

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma/schema.prisma ./dist


EXPOSE 3000

CMD ["npm", "run", "start"]
