from fastapi import APIRouter, HTTPException
from app.db import crud

router = APIRouter()

@router.post("/auth/register")
async def register(payload: dict):
    # payload: {"username": "...", "password": "..."}
    if crud.find_user(payload["username"]):
        raise HTTPException(status_code=400, detail="User exists")
    user = {"id": len(crud._store["users"]) + 1, "username": payload["username"], "password": payload["password"]}
    crud.add_user(user)
    return {"ok": True}

@router.post("/auth/login")
async def login(payload: dict):
    u = crud.find_user(payload["username"])
    if not u or u["password"] != payload["password"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # Для простоты возвращаем "fake token"
    return {"access_token": f"token-for-{u['username']}", "token_type": "bearer"}