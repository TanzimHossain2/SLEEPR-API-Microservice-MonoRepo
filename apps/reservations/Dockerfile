# Development stage
FROM node:23-alpine AS development

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json, pnpm-lock.yaml, and install pnpm
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copy the rest of the application code
COPY . .

# Run the build command
RUN pnpm run build

# Production stage
FROM node:23-alpine AS production

# Set production environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set the working directory
WORKDIR /usr/src/app

# Copy production dependencies only
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --only=production

# Copy the built app from the development stage
COPY --from=development /usr/src/app/dist ./dist

# Run the application
CMD ["node", "dist/apps/reservations/main"]
