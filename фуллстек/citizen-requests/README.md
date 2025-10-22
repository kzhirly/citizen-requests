# Сервис обращений граждан — ЛР №2

Выполнила: Надежда Карпова  
Тема: Обращения граждан

## Кратко
Лабораторная №2: развёртывание сервера, базовая маршрутизация, health-check.

## Что реализовано
- Backend: FastAPI
  - Эндпоинты: /api/health, /api/auth/register, /api/auth/login, /api/requests (POST, GET, GET/{id})
  - mock DB и simple rule-based classifier (placeholder для ML)
  - Swagger: /docs
- Frontend: React (Vite) — базовый skeleton страниц: Register, Login, SubmitRequest, History (фильтры UI)
- Инструкции запуска и пример curl-запросов

## Запуск
### Backend:
cd backend
# рекомендовано в виртуальном окружении
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

Swagger: http://localhost:8000/docs
Health-check: http://localhost:8000/api/health

### Frontend:

cd frontend
npm install   # если ещё не установлено
npm run dev
Frontend: http://localhost:5173
