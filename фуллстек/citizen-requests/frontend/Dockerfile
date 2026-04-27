# Фронтенд на React + Vite
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production && npm cache clean --force

# Копируем исходники
COPY . .

# Сборка приложения
RUN npm run build

# Продакшн этап с Nginx
FROM nginx:alpine

# Копируем сборку из builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем кастомный конфиг Nginx (если нужен)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]