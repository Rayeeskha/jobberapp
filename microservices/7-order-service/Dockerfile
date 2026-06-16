# =========================
# Builder Stage
# =========================
FROM node:22-alpine AS builder

ARG NPM_TOKEN

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY .npmrc ./

RUN npm ci

COPY . .

RUN npm run build

# =========================
# Production Stage
# =========================
FROM node:22-alpine

ARG NPM_TOKEN

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./
COPY tsconfig.json ./
COPY .npmrc ./

RUN npm install -g pm2

RUN npm ci --omit=dev

COPY --from=builder /app/build ./build

EXPOSE 4006

CMD ["npm", "run", "start"]
