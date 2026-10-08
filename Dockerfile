FROM node:22-alpine

WORKDIR /app

# Install curl for container health checks
RUN apk --no-cache add curl

# Install dependencies with caching layer
COPY package*.json ./
RUN npm install --omit=dev

# Copy application files
COPY . .

# Default port
ENV PORT=3000
EXPOSE 3000

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "server.mjs"]
