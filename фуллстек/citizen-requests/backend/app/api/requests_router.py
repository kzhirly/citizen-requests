# backend/app/api/requests_router.py - ИСПРАВЛЕННАЯ ВЕРСИЯ
from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.db.database import get_session
from app.db import crud
from app.api.deps import role_required
from app.services.classifier import classify  # <-- ДОБАВИТЬ ЭТУ СТРОКУ

router = APIRouter()

@router.get("/requests")
def list_requests(user=Depends(role_required(["guest", "user", "manager", "admin"])), db: Session = Depends(get_session)):
    return crud.get_all_requests(db)

@router.post("/requests")
def create_request(
    payload: dict, 
    user=Depends(role_required(["user", "manager", "admin"])), 
    db: Session = Depends(get_session)
):
    # Получаем текст обращения
    description = payload.get("description", "")
    title = payload.get("title", "")
    
    # ОПРЕДЕЛЯЕМ ОТДЕЛ С ПОМОЩЬЮ КЛАССИФИКАТОРА
    assigned_department = classify(description, title)
    
    # Добавляем данные в payload
    payload["full_name"] = user["username"]
    payload["assigned_department"] = assigned_department  # <-- ВАЖНО!
    
    # Создаем заявку
    return crud.create_request(db, payload)

@router.put("/requests/{id}")
def edit_request(
    id: int, 
    payload: dict, 
    user=Depends(role_required(["user", "manager", "admin"])), 
    db: Session = Depends(get_session)
):
    return crud.update_request(db, id, payload, user)

@router.patch("/requests/{id}/close")
def close_request(
    id: int, 
    user=Depends(role_required(["manager", "admin"])), 
    db: Session = Depends(get_session)
):
    return crud.close_request(db, id)