# # =========================
# # Stage 1 — Build the app
# # =========================
# FROM node:20-alpine AS builder

# WORKDIR /app

# # Copy package files first for caching
# COPY package*.json ./

# # Improve reliability for npm installs
# RUN npm config set fetch-retries 5
# RUN npm config set fetch-timeout 120000
# RUN npm config set registry https://registry.npmjs.org/

# # Install dependencies
# RUN npm install

# # Copy all project files
# COPY . .

# # Build the app
# RUN npm run build

# # =========================
# # Stage 2 — Production image
# # =========================
# FROM node:20-alpine AS runner

# WORKDIR /app

# # Copy only the required files
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public

# # Copy TypeScript config (optional for runtime)
# COPY --from=builder /app/next.config.ts ./next.config.ts
# COPY --from=builder /app/.env ./.env

# # Install only production dependencies
# RUN npm install --omit=dev

# # Expose the default Next.js port
# EXPOSE 3000

# # Run the production server
# CMD ["npm", "start"]




# =========================
# Stage 1 — Build the app
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Improve reliability for npm installs
RUN npm config set fetch-retries 5
RUN npm config set fetch-timeout 120000
RUN npm config set registry https://registry.npmjs.org/

# Install all dependencies (including dev like typescript)
RUN npm install

# Copy all project files
COPY . .

# Build the app
RUN npm run build

# =========================
# Stage 2 — Production image
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only necessary build output and files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# ✅ Install only production deps + TypeScript (needed for next.config.ts)
RUN npm install --omit=dev && npm install typescript

# Copy env if required
# COPY --from=builder /app/.env ./.env

# Expose port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
