# backend/app/api/requests_router.py
import os
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlmodel import Session
from app.db.database import get_session
from app.db import crud
from app.api.deps import role_required
from app.services.classifier import classify
from app.services.s3_service import upload_file

router = APIRouter()

@router.get("/requests")
def list_requests(
    user=Depends(role_required(["guest", "user", "manager", "admin"])), 
    db: Session = Depends(get_session)
):
    return crud.get_all_requests(db)


@router.post("/requests")
def create_request(
    payload: dict, 
    user=Depends(role_required(["user", "manager", "admin"])), 
    db: Session = Depends(get_session)
):
    description = payload.get("description", "")
    title = payload.get("title", "")
    
    assigned_department = classify(description, title)
    
    payload["full_name"] = user["username"]
    payload["assigned_department"] = assigned_department
    
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


# ========== ЭНДПОИНТЫ ДЛЯ ФАЙЛОВ (MinIO S3) ==========

@router.post("/requests/{request_id}/files")
async def upload_request_file(
    request_id: int,
    file: UploadFile = File(...),
    user=Depends(role_required(["user", "manager", "admin"])),
    db: Session = Depends(get_session)
):
    """Загружает файл в MinIO S3"""
    
    # Проверяем, существует ли обращение
    request_obj = crud.get_request_by_id(db, request_id)
    if not request_obj:
        raise HTTPException(status_code=404, detail="Обращение не найдено")
    
    # Проверка прав
    if user["role"] != "admin" and request_obj.full_name != user["username"]:
        raise HTTPException(status_code=403, detail="Нет прав")
    
    # Ограничения по типу файла
    allowed_extensions = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"]
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"Недопустимый тип файла")
    
    # Ограничение по размеру (5 МБ)
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Файл слишком большой")
    
    # Загружаем файл в MinIO
    result = upload_file(content, file.filename, request_id, user["username"])
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail="Ошибка загрузки файла")
    
    return result


@router.get("/requests/{request_id}/files")
async def get_request_files(
    request_id: int,
    user=Depends(role_required(["user", "manager", "admin"])),
    db: Session = Depends(get_session)
):
    """Возвращает список файлов, прикрепленных к обращению в MinIO"""
    
    request_obj = crud.get_request_by_id(db, request_id)
    if not request_obj:
        raise HTTPException(status_code=404, detail="Обращение не найдено")
    
    if user["role"] != "admin" and request_obj.full_name != user["username"]:
        raise HTTPException(status_code=403, detail="Нет прав")
    
    from app.services.s3_service import list_files
    prefix = f"requests/{request_id}/{user['username']}"
    files = list_files(prefix)
    
    return {"request_id": request_id, "files": files}