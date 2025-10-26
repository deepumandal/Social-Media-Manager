FROM node:23-alpine3.20 AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# Stage 2: Runtime stage
FROM node:23-alpine3.20 AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/scripts ./scripts

EXPOSE 3000

# Create startup script that runs migrations then starts the app
RUN echo '#!/bin/sh\n\
echo "🚀 Starting application with database migration..."\n\
node scripts/startup.js && node server.js\n\
' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]
