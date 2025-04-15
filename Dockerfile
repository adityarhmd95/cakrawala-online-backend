# Stage 1: Build
FROM node:16-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies including devDependencies
RUN npm ci

# Copy all files
COPY . .

# Build the project (if you have any build steps)
RUN npm run build

# Stage 2: Production
FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/.env ./

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]