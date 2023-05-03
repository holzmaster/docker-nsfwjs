FROM node:buster-slim as builder
    WORKDIR /usr/app
    COPY package.json package-lock.json ./
    RUN npm ci
    COPY . .
    RUN npm run build

FROM node:buster-slim as prod-dependencies
    WORKDIR /usr/app
    COPY package.json package-lock.json ./
    RUN npm ci --omit=dev

FROM node:buster-slim
    WORKDIR /app
    COPY --from=builder /usr/app/node_modules /app/node_modules
    COPY --from=builder /usr/app/dist /app/dist
    EXPOSE 3333
    CMD ["node", "dist/server.js"]
