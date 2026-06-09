FROM oven/bun:1.1 AS builder
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun build src/index.ts --target=node --outdir=dist

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .
EXPOSE 3001
CMD ["node", "--import", "./dist/instrumentation.js", "dist/index.js"]
