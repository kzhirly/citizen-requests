# backend/app/api/requests_router.py
import os
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlmodel import Session
from app.db.database import get_session
from app.db import crud
from app.api.deps import role_required
from app.services.classifier import classify

# Создаем папку для загрузок, если её нет
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

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
    # Получаем текст обращения
    description = payload.get("description", "")
    title = payload.get("title", "")
    
    # Определяем отдел с помощью классификатора
    assigned_department = classify(description, title)
    
    # Добавляем данные в payload
    payload["full_name"] = user["username"]
    payload["assigned_department"] = assigned_department
    
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


# ========== НОВЫЕ ЭНДПОИНТЫ ДЛЯ ФАЙЛОВ ==========

@router.post("/requests/{request_id}/files")
async def upload_request_file(
    request_id: int,
    file: UploadFile = File(...),
    user=Depends(role_required(["user", "manager", "admin"])),
    db: Session = Depends(get_session)
):
    """Загружает файл к обращению и сохраняет в папку uploads"""
    
    # Проверяем, существует ли обращение
    request_obj = crud.get_request_by_id(db, request_id)
    if not request_obj:
        raise HTTPException(status_code=404, detail="Обращение не найдено")
    
    # Проверяем права (пользователь может загружать файлы только к своим обращениям)
    if user["role"] != "admin" and request_obj.full_name != user["username"]:
        raise HTTPException(status_code=403, detail="Нет прав на загрузку файла к этому обращению")
    
    # Ограничения по типу файла
    allowed_extensions = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"]
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"Недопустимый тип файла. Разрешены: {', '.join(allowed_extensions)}")
    
    # Ограничение по размеру (5 МБ)
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Файл слишком большой. Максимум 5 МБ")
    
    # Создаем уникальное имя файла (чтобы не было конфликтов)
    safe_filename = f"{request_id}_{user['username']}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    
    # Сохраняем файл
    with open(file_path, "wb") as buffer:
        buffer.write(content)
    
    return {
        "success": True,
        "filename": file.filename,
        "saved_as": safe_filename,
        "path": file_path,
        "size": len(content)
    }


@router.get("/requests/{request_id}/files")
async def get_request_files(
    request_id: int,
    user=Depends(role_required(["guest", "user", "manager", "admin"])),
    db: Session = Depends(get_session)
):
    """Возвращает список файлов, прикрепленных к обращению"""
    
    # Проверяем, существует ли обращение
    request_obj = crud.get_request_by_id(db, request_id)
    if not request_obj:
        raise HTTPException(status_code=404, detail="Обращение не найдено")
    
    # Проверка прав: гость не видит файлы, обычный пользователь только свои
    if user["role"] == "guest":
        raise HTTPException(status_code=403, detail="Гости не могут просматривать файлы")
    
    if user["role"] != "admin" and request_obj.full_name != user["username"]:
        raise HTTPException(status_code=403, detail="Нет прав на просмотр файлов этого обращения")
    
    # Ищем файлы, относящиеся к этому обращению
    files = []
    if os.path.exists(UPLOAD_DIR):
        for filename in os.listdir(UPLOAD_DIR):
            if filename.startswith(f"{request_id}_"):
                files.append({
                    "filename": filename,
                    "original_name": "_".join(filename.split("_")[2:]) if len(filename.split("_")) > 2 else filename,
                    "size": os.path.getsize(os.path.join(UPLOAD_DIR, filename))
                })
    
    return {"request_id": request_id, "files": files}


@router.get("/files/{filename}")
async def download_file(
    filename: str,
    user=Depends(role_required(["user", "manager", "admin"]))
):
    """Скачивает файл по имени"""
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    # Проверка безопасности: не выходим за пределы папки uploads
    if not os.path.exists(file_path) or not filename.startswith(tuple(str(i) for i in range(10))):
        raise HTTPException(status_code=404, detail="Файл не найден")
    
    from fastapi.responses import FileResponse
    return FileResponse(file_path, filename=filename)