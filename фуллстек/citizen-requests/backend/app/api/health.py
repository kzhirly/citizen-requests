from fastapi import APIRouter
from app.db import crud

router = APIRouter()

@router.get("/health")
async def health_check():
    db_ok = crud.ping()
    return {"status": "ok" if db_ok else "error", "db": "ok" if db_ok else "error"}