# EM-NET · Node.js / Express
FROM node:24-alpine AS deps
WORKDIR /app

# Copy only the manifests first so this layer is cached when code changes.
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:24-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY server.js ./

# The official Node image ships a non-root "node" user.
USER node

EXPOSE 3000

CMD ["node", "server.js"]
