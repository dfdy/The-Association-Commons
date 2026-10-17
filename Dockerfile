# Software-only image. Seed and privacy policy content use separate read-only mounts.
FROM node:22-bookworm-slim
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY software/package.json software/package-lock.json ./software/
RUN cd software && npm ci --omit=dev --ignore-scripts && npm cache clean --force
COPY software/ ./software/
COPY LICENSE LICENSING.md Dockerfile docker-compose.yml ./
# Offer the corresponding software source through the existing AGPL source link.
RUN tar --exclude='./software/node_modules' --exclude='./software/source.tar.gz' \
    -czf /tmp/source.tar.gz LICENSE LICENSING.md Dockerfile docker-compose.yml software \
    && mv /tmp/source.tar.gz software/source.tar.gz \
    && chown -R node:node /app
USER node
EXPOSE 3000
CMD ["node", "software/server.mjs"]
