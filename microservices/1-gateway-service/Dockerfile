FROM node:22-alpine AS builder

WORKDIR /app

ARG NPM_TOKEN

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
COPY tools ./tools

RUN echo "@Rayeeskha:registry=https://npm.pkg.github.com/" > /root/.npmrc && \
  echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> /root/.npmrc && \
  echo "always-auth=true" >> /root/.npmrc

RUN npm ci
RUN npm run build


FROM node:22-alpine

WORKDIR /app

ARG NPM_TOKEN

RUN apk add --no-cache curl

COPY package*.json ./
COPY tsconfig.json ./

RUN echo "@Rayeeskha:registry=https://npm.pkg.github.com/" > /root/.npmrc && \
  echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> /root/.npmrc && \
  echo "always-auth=true" >> /root/.npmrc

RUN npm install -g pm2
RUN npm ci --omit=dev

COPY --from=builder /app/build ./build

EXPOSE 4000

CMD ["npm", "run", "start"]
