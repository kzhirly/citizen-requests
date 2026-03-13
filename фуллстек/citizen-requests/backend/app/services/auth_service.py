# app/services/auth_service.py
from datetime import timedelta
from sqlmodel import Session
from app.core import security
from app.db import crud

def authenticate_user(db: Session, username: str, password: str):
    user = crud.get_user_by_username(db, username)
    if not user:
        return None
    if not security.verify_password(password, user.password):
        return None
    return user

def create_tokens_for_user(user):
    access_token = security.create_access_token({"sub": user.username, "role": user.role})
    refresh_token = security.create_refresh_token({"sub": user.username})
    return access_token, refresh_token

def verify_refresh_token(db: Session, token: str):
    payload = security.decode_token(token)
    if not payload or payload.get("type") != "refresh":
        return None
    username = payload.get("sub")
    if not username:
        return None
    stored = crud.get_refresh_token(db, token)
    if not stored:
        return None
    user = crud.get_user_by_username(db, username)
    return user