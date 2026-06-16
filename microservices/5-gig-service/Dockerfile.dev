FROM node:22-alpine AS builder

ARG NPM_TOKEN

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY .npmrc ./

RUN npm ci

COPY src ./src

# If your project contains any of these folders,
# uncomment them as needed
# COPY tools ./tools
# COPY assets ./assets
# COPY emails ./emails

RUN npm run build

# ==========================
# Production Image
# ==========================

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

EXPOSE 4004

CMD ["npm", "run", "start"]
