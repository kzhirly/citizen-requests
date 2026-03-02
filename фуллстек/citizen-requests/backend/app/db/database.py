from sqlmodel import create_engine, SQLModel, Session
from pathlib import Path

DB_FILE = Path(__file__).resolve().parents[1] / "app.db"
DATABASE_URL = f"sqlite:///{DB_FILE}"

engine = create_engine(DATABASE_URL, echo=False)

def create_db_and_tables():
    from app.db.models import User, Request
    SQLModel.metadata.create_all(engine)

def get_session():
    # Важно: session через with, FastAPI сам управляет
    with Session(engine) as session:
        yield session