FROM node:23-alpine3.20 AS build

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies using npm (more reliable for Docker builds)
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Runtime stage
FROM node:23-alpine3.20 AS runner

WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY package.json ./
RUN npm install --only=production

# Copy built application and necessary files
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
# COPY --from=build /app/scripts ./scripts
# COPY --from=build /app/src ./src

EXPOSE 3000

# # Create startup script that runs migrations then starts the app
# RUN echo '#!/bin/sh\n\
# echo "🚀 Starting application with database migration..."\n\
# node scripts/startup.js\n\
# ' > /app/start.sh && chmod +x /app/start.sh

# CMD ["node", "scripts/startup.js"]

CMD ["node", "server.js"]