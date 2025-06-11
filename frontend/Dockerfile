# Etap budowania
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

# Etap produkcyjny
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "start"]