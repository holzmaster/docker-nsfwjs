FROM node:buster-slim as builder
WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:buster-slim
WORKDIR /app
COPY --from=builder /usr/app /app/
EXPOSE 3333
CMD ["npm", "start"]
