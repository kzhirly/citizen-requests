from fastapi import APIRouter
from app.db import mock_db

router = APIRouter()

@router.get("/health")
async def health_check():
    db_ok = mock_db.ping()
    return {"status": "ok" if db_ok else "error", "db": "ok" if db_ok else "error"}