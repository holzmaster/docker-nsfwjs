FROM node:buster-slim as base
    WORKDIR /app

FROM base as builder
    RUN --mount=type=bind,source=package.json,target=package.json \
        --mount=type=bind,source=package-lock.json,target=package-lock.json \
        --mount=type=cache,target=/root/.npm \
        npm ci
    COPY . .
    RUN npm run build

FROM base as runtime-dependencies
    RUN --mount=type=bind,source=package.json,target=package.json \
        --mount=type=bind,source=package-lock.json,target=package-lock.json \
        --mount=type=cache,target=/root/.npm \
        npm ci --omit=dev

FROM base
    ENV MODEL_DIR=/app/node_modules/nsfwjs/dist/models/inception_v3
    COPY package.json package-lock.json ./
    COPY --from=runtime-dependencies /app/node_modules /app/node_modules

    COPY --from=builder /app/dist /app/dist
    COPY ./src/healthcheck.mjs /healthcheck.mjs

    EXPOSE 8080
    CMD ["node", "dist/server.js"]

    HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
        CMD /healthcheck.mjs
