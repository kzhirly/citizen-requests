from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    password: str
    role: str = "guest"  # роли: guest, user, manager, admin

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