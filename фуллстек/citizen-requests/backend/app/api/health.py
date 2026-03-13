# app/api/health.py
from fastapi import APIRouter
from app.db.database import engine

router = APIRouter()

@router.get("/health")
async def health_check():
    try:
        with engine.connect() as conn:
            conn.execute("SELECT 1")
        return {"status": "ok", "db": "ok"}
    except:
        return {"status": "error", "db": "error"}