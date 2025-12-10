from fastapi import APIRouter, HTTPException
from app.db import crud
from app.security.jwt_handler import create_token

router = APIRouter()


@router.post("/register")
async def register_user(payload: dict):
    username = payload.get("username")
    password = payload.get("password")

    if crud.find_user(username):
        raise HTTPException(status_code=400, detail="User already exists")

    crud.add_user({"username": username, "password": password})
    return {"status": "created"}


@router.post("/login")
async def login_user(payload: dict):
    username = payload.get("username")
    password = payload.get("password")

    user = crud.find_user(username)
    if not user or user["password"] != password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(username)
    return {"token": token}