# app/api/auth.py
from fastapi import APIRouter, HTTPException, Depends, Request
from datetime import timedelta
from sqlmodel import Session
from app.db.database import get_session
from app.db import crud
from app.services import auth_service
from app.core import security

router = APIRouter()

@router.post("/register")
def register(payload: dict, db: Session = Depends(get_session)):
    username = payload.get("username")
    password = payload.get("password")
    role = payload.get("role", "user")
    if not username or not password:
        raise HTTPException(status_code=400, detail="Missing fields")

    # Хэшируем пароль
    hashed = security.hash_password(password)
    created = crud.create_user(db, username, hashed, role)
    if not created:
        raise HTTPException(status_code=400, detail="User exists")
    return {"message": "User created", "user_id": created.id}

@router.post("/login")
def login(payload: dict, request: Request, db: Session = Depends(get_session)):
    username = payload.get("username")
    password = payload.get("password")
    user = auth_service.authenticate_user(db, username, password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token, refresh_token = auth_service.create_tokens_for_user(user)

    # Сохраняем refresh токен в БД
    user_agent = request.headers.get("user-agent")
    client_ip = request.client.host
    crud.create_refresh_token(
        db, user.id, refresh_token,
        timedelta(days=security.REFRESH_TOKEN_EXPIRE_DAYS),
        user_agent, client_ip
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh")
def refresh(payload: dict, db: Session = Depends(get_session)):
    refresh_token = payload.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=400, detail="Missing refresh token")

    user = auth_service.verify_refresh_token(db, refresh_token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    # Создаём новую пару
    new_access, new_refresh = auth_service.create_tokens_for_user(user)

    # Отзываем старый refresh токен
    crud.revoke_refresh_token(db, refresh_token)

    # Сохраняем новый refresh токен (без user-agent/ip для простоты)
    crud.create_refresh_token(
        db, user.id, new_refresh,
        timedelta(days=security.REFRESH_TOKEN_EXPIRE_DAYS)
    )

    return {
        "access_token": new_access,
        "refresh_token": new_refresh,
        "token_type": "bearer"
    }

@router.post("/logout")
def logout(payload: dict, db: Session = Depends(get_session)):
    refresh_token = payload.get("refresh_token")
    if refresh_token:
        crud.revoke_refresh_token(db, refresh_token)
    return {"message": "Logged out"}