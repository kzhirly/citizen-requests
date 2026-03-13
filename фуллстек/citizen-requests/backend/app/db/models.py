# app/db/models.py
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    password: str            # теперь здесь будет хэш
    role: str = "guest"

    refresh_tokens: List["RefreshToken"] = Relationship(back_populates="user")

class RefreshToken(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    token_hash: str          # храним хэш токена (sha256)
    expires_at: datetime
    revoked: bool = False
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None

    user: User = Relationship(back_populates="refresh_tokens")

class Request(SQLModel, table=True):
    request_id: Optional[int] = Field(default=None, primary_key=True)
    full_name: Optional[str]
    contact: Optional[str]
    topic: Optional[str]
    title: Optional[str]
    description: Optional[str]
    assigned_department: Optional[str]
    status: Optional[str] = "new"
    created_at: Optional[str] = Field(default_factory=lambda: datetime.utcnow().isoformat())
    response: Optional[str] = None