FROM node:18-alpine

# Create app folder
WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install

# Copy app files
COPY backend/ backend/

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# ✅ Fix permissions to allow DB file to be created
RUN mkdir -p /app/backend && chown -R appuser:appgroup /app

USER appuser

# Expose backend port
EXPOSE 3000

CMD ["node", "backend/server.js"]
