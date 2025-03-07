FROM node:20-slim

WORKDIR /app

# Create necessary directories and set permissions for the root directory
RUN mkdir -p node_modules && \
    mkdir -p .vite && \
    chown -R 1000:1000 /app

# Switch to non-root user with UID 1000
USER 1000:1000

# Copy package files first
COPY --chown=1000:1000 package*.json ./
RUN npm install

# Copy vite config separately to ensure it has proper permissions
COPY --chown=1000:1000 vite.config.js ./

# Copy remaining files
COPY --chown=1000:1000 . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]