# Build stage
FROM node:20-alpine AS builder

WORKDIR /application

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Spin off the image
FROM node:20-alpine

WORKDIR /application

ENV PORT=3000
ENV REDIS_HOST=host.docker.internal
ENV REDIS_PORT=6379
ENV INFERENCE_HOST=host.docker.internal
ENV INFERENCE_PORT=8080

COPY --from=builder /application/node_modules ./node_modules
COPY --from=builder /application/dist ./dist
COPY package.json .

CMD ["node", "dist/server.js"]