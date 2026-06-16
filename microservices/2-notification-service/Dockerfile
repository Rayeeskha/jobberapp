# =========================
# Build Stage
# =========================
FROM node:22-alpine AS builder

ARG NPM_TOKEN

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY .npmrc ./

# Verify token exists (remove after debugging)
RUN test -n "$NPM_TOKEN"

RUN npm ci

COPY src ./src
COPY tools ./tools

RUN npm run build

# =========================
# Production Stage
# =========================
FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./
COPY .npmrc ./

ARG NPM_TOKEN

RUN test -n "$NPM_TOKEN"

RUN npm ci --omit=dev


COPY --from=builder /app/build ./build

EXPOSE 4001

CMD ["node", "build/src/app.js"]
