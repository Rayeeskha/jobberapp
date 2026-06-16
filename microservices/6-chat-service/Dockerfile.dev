# =========================
# Builder Stage
# =========================
FROM node:22-alpine AS builder

ARG NPM_TOKEN

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY .npmrc ./

# Install all dependencies including dev dependencies
RUN npm ci

# Copy application source
COPY . .

# Build application
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

# Install PM2
RUN npm install -g pm2

# Install production dependencies
RUN npm ci --omit=dev

# Copy build artifacts
COPY --from=builder /app/build ./build

EXPOSE 4005

CMD ["npm", "run", "start"]
