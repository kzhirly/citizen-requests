# app/core/config.py
import os

# В реальном проекте используйте переменные окружения, здесь для простоты — константы
SECRET_KEY = "supersecretkey123456789"  # минимум 32 символа для HS256
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15        # короткое время жизни access
REFRESH_TOKEN_EXPIRE_DAYS = 7           # долгое время жизни refresh