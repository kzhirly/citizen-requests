FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем ВСЕ зависимости (включая dev, т.к. нужен Vite)
RUN npm ci

# Копируем исходники
COPY . .

# Сборка приложения
RUN npm run build

# Продакшн этап с Nginx
FROM nginx:alpine

# Копируем сборку из builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]