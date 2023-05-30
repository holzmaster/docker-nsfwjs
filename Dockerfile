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

FROM alpine:latest as model
    WORKDIR /model

    # Links taken from the repo of nsfwjs:
    # https://github.com/infinitered/nsfwjs
    ADD https://github.com/infinitered/nsfwjs/raw/master/example/nsfw_demo/public/model/group1-shard1of6 \
        https://github.com/infinitered/nsfwjs/raw/master/example/nsfw_demo/public/model/group1-shard2of6 \
        https://github.com/infinitered/nsfwjs/raw/master/example/nsfw_demo/public/model/group1-shard3of6 \
        https://github.com/infinitered/nsfwjs/raw/master/example/nsfw_demo/public/model/group1-shard4of6 \
        https://github.com/infinitered/nsfwjs/raw/master/example/nsfw_demo/public/model/group1-shard5of6 \
        https://github.com/infinitered/nsfwjs/raw/master/example/nsfw_demo/public/model/group1-shard6of6 \
        https://github.com/infinitered/nsfwjs/raw/master/example/nsfw_demo/public/model/model.json \
        ./

FROM node:buster-slim
    WORKDIR /app

    RUN apt-get update -yqqq \
        && apt-get install -yqqq curl \
        && apt-get clean \
        && rm -rf /var/lib/apt/lists/*

    ENV MODEL_DIR=/model
    COPY --from=model /model /model

    COPY package.json package-lock.json ./
    COPY --from=builder /usr/app/node_modules /app/node_modules

    COPY --from=builder /usr/app/dist /app/dist

    EXPOSE 8080
    CMD ["node", "dist/server.js"]

    HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
        CMD curl --fail -I http://localhost:8080/_health
