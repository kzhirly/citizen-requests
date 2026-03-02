from fastapi import APIRouter, HTTPException, Depends
from app.db import crud
from jose import jwt
from datetime import datetime, timedelta
from app.api.deps import role_required
from app.db.database import get_session

SECRET = "SUPERSECRET"
ALGO = "HS256"

router = APIRouter()

@router.post("/register")
def register(payload: dict, db = Depends(get_session)):
    username = payload.get("username")
    password = payload.get("password")
    role = payload.get("role", "user")
    if not username or not password:
        raise HTTPException(status_code=400, detail="Missing fields")
    created = crud.create_user(db, username, password, role)
    if not created:
        raise HTTPException(status_code=400, detail="User exists")
    return {"message": "User created", "user_id": created.id}

@router.post("/login")
def login(payload: dict, db = Depends(get_session)):
    username = payload.get("username")
    password = payload.get("password")
    user = crud.verify_user(db, username, password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token_data = {
        "sub": username,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(hours=8)
    }
    token = jwt.encode(token_data, SECRET, algorithm=ALGO)
    return {"access_token": token, "token_type": "bearer"}

@router.put("/users/{user_id}/role")
def set_role(user_id: int, payload: dict, db = Depends(get_session), user=Depends(role_required(["admin"]))):
    new_role = payload.get("role")
    updated = crud.set_user_role(db, user_id, new_role)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": f"Role updated to {new_role}"}