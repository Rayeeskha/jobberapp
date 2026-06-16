FROM node:22-alpine AS builder

ARG NPM_TOKEN

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY .npmrc ./
COPY src ./src

RUN npm ci
RUN npm run build

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

EXPOSE 4002

CMD ["npm", "run", "start"]
