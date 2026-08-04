# syntax=docker/dockerfile:1.7
# Compliflow Next.js Standalone — Multi-Stage für minimales Production-Image

FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN NODE_ENV=development npm ci --prefer-offline --no-audit --progress=false

# ---------- Builder ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# WICHTIG: build:standalone (BUILD_STANDALONE=1) — nur so entsteht .next/standalone,
# das der Runner unten kopiert. Normales `npm run build` erzeugt es NICHT → Build bricht ab.
RUN npm run build:standalone

# ---------- Runner ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S nextjs -G nodejs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Waitlist-Datei-Fallback: /app gehört root, der Prozess läuft als nextjs —
# ohne dieses Verzeichnis scheitert fs.mkdir("/app/.data") mit EACCES und
# bestätigte Waitlist-Emails gehen still verloren. In Coolify zusätzlich als
# Persistent Storage mounten, sonst ist die Datei nach jedem Redeploy weg.
RUN mkdir -p /app/.data && chown nextjs:nodejs /app/.data

USER nextjs

EXPOSE 3000

# /api/health liefert 503, wenn kritische Integrationen down sind — genau dafür
# ist die Route gebaut; ein Ping auf "/" würde das nie bemerken.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
