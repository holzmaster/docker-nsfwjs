FROM node:buster-slim as base
    WORKDIR /app

FROM base as builder
    RUN --mount=type=bind,source=package.json,target=package.json \
        --mount=type=bind,source=package-lock.json,target=package-lock.json \
        --mount=type=cache,target=/root/.npm \
        npm ci
    COPY . .
    RUN npm run build

FROM base as prod-dependencies

    RUN --mount=type=bind,source=package.json,target=package.json \
        --mount=type=bind,source=package-lock.json,target=package-lock.json \
        --mount=type=cache,target=/root/.npm \
        npm ci --omit=dev

FROM scratch as model
    WORKDIR /model

    # Links taken from the repo of nsfwjs:
    # https://github.com/infinitered/nsfwjs
    ADD https://github.com/infinitered/nsfwjs/raw/master/examples/nsfw_demo/public/model/group1-shard1of6 \
        https://github.com/infinitered/nsfwjs/raw/master/examples/nsfw_demo/public/model/group1-shard2of6 \
        https://github.com/infinitered/nsfwjs/raw/master/examples/nsfw_demo/public/model/group1-shard3of6 \
        https://github.com/infinitered/nsfwjs/raw/master/examples/nsfw_demo/public/model/group1-shard4of6 \
        https://github.com/infinitered/nsfwjs/raw/master/examples/nsfw_demo/public/model/group1-shard5of6 \
        https://github.com/infinitered/nsfwjs/raw/master/examples/nsfw_demo/public/model/group1-shard6of6 \
        https://github.com/infinitered/nsfwjs/raw/master/examples/nsfw_demo/public/model/model.json \
        ./

FROM base

    ENV MODEL_DIR=/model
    COPY --from=model /model /model

    COPY package.json package-lock.json ./
    COPY --from=builder /app/node_modules /app/node_modules

    COPY --from=builder /app/dist /app/dist
    COPY ./src/healthcheck.mjs /healthcheck.mjs

    EXPOSE 8080
    CMD ["node", "dist/server.js"]

    HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
        CMD /healthcheck.mjs
