from fastapi import APIRouter, HTTPException
from app.db import crud
from jose import jwt
from datetime import datetime, timedelta

SECRET = "SUPERSECRET"
ALGO = "HS256"

router = APIRouter()

# ---------------- REGISTER ----------------
@router.post("/register")
def register(payload: dict):
    username = payload.get("username")
    password = payload.get("password")

    if not username or not password:
        raise HTTPException(status_code=400, detail="Missing fields")

    created = crud.create_user(username, password)

    if not created:
        raise HTTPException(status_code=400, detail="User exists")

    return {"message": "User created", "user_id": created["id"]}

# ---------------- LOGIN ----------------
@router.post("/login")
def login(payload: dict):
    username = payload.get("username")
    password = payload.get("password")

    user = crud.verify_user(username, password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token_data = {
        "sub": username,
        "exp": datetime.utcnow() + timedelta(hours=8)
    }

    token = jwt.encode(token_data, SECRET, algorithm=ALGO)

    return {"access_token": token, "token_type": "bearer"}