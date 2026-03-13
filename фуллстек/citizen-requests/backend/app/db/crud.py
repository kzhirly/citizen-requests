# app/db/crud.py
import hashlib
from datetime import datetime, timedelta
from sqlmodel import Session
from app.db.models import User, Request, RefreshToken

# ---------- User ----------
def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, username: str, password_hash: str, role: str = "user"):
    existing = db.query(User).filter(User.username == username).first()
    if existing:
        return None
    user = User(username=username, password=password_hash, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def verify_user(db: Session, username: str, password_hash: str):
    # используется в старом коде, но мы будем использовать get_user_by_username + verify_password
    return db.query(User).filter(User.username == username, User.password == password_hash).first()

def set_user_role(db: Session, user_id: int, new_role: str):
    user = db.query(User).get(user_id)
    if user:
        user.role = new_role
        db.commit()
    return user

# ---------- Refresh Tokens ----------
def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()

def create_refresh_token(db: Session, user_id: int, token_str: str, expires_delta: timedelta,
                         user_agent: str = None, ip: str = None):
    token_hash = hash_token(token_str)
    expires_at = datetime.utcnow() + expires_delta
    rt = RefreshToken(
        user_id=user_id,
        token_hash=token_hash,
        expires_at=expires_at,
        user_agent=user_agent,
        ip_address=ip
    )
    db.add(rt)
    db.commit()
    db.refresh(rt)
    return rt

def get_refresh_token(db: Session, token_str: str):
    token_hash = hash_token(token_str)
    return db.query(RefreshToken).filter(
        RefreshToken.token_hash == token_hash,
        RefreshToken.revoked == False,
        RefreshToken.expires_at > datetime.utcnow()
    ).first()

def revoke_refresh_token(db: Session, token_str: str):
    token_hash = hash_token(token_str)
    rt = db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash).first()
    if rt:
        rt.revoked = True
        db.commit()
    return rt

def revoke_all_user_tokens(db: Session, user_id: int):
    db.query(RefreshToken).filter(RefreshToken.user_id == user_id).update({"revoked": True})
    db.commit()

# ---------- Requests ----------
def get_all_requests(db: Session):
    return db.query(Request).all()

def create_request(db: Session, payload: dict):
    req = Request(**payload)
    db.add(req)
    db.commit()
    db.refresh(req)
    return req

def update_request(db: Session, id: int, payload: dict, user: dict):
    req = db.query(Request).get(id)
    if not req:
        return {"error": "not found"}
    if user["role"] == "user" and req.full_name != user["username"]:
        return {"error": "forbidden"}
    for k, v in payload.items():
        setattr(req, k, v)
    db.commit()
    return req

def close_request(db: Session, id: int):
    req = db.query(Request).get(id)
    if req:
        req.status = "closed"
        db.commit()
    return req

