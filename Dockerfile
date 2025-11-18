# Etapa 1 — Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os manifests e instala dependências
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copia o restante do código
COPY . .

# O Dokploy vai injetar NEXT_PUBLIC_API_URL automaticamente
RUN npm run build

# Etapa 2 — Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Copia apenas o necessário para execução
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.* ./

# Variáveis padrão
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
