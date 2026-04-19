from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import health, auth, requests_router, seo_router
from app.db.database import create_db_and_tables

app = FastAPI(title="Citizen Requests API")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(requests_router.router, prefix="/api")
app.include_router(seo_router.router, prefix="")  # robots.txt и sitemap.xml без префикса

@app.get("/")
def root():
    return {"message": "API работает!"}