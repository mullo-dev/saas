# Étape 1 : Builder
FROM node:18 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : Production image
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production

# Si tu utilises Prisma, tu dois générer les fichiers client dans le build
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
