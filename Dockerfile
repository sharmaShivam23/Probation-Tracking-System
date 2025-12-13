
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm config set fetch-retries 5
RUN npm config set fetch-timeout 120000
RUN npm config set registry https://registry.npmjs.org/

RUN npm install


COPY . .

RUN npm run build


FROM node:20-alpine AS runner

WORKDIR /app

# Copy only necessary build output and files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# Install only production deps + TypeScript (needed for next.config.ts)
RUN npm install --omit=dev && npm install typescript

# Copy env if required
# COPY --from=builder /app/.env ./.env

# Expose port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
