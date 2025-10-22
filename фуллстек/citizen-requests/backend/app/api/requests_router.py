from fastapi import APIRouter, HTTPException, Query
from app.db import mock_db
from app.services import classifier
from datetime import datetime

router = APIRouter()

@router.post("/requests")
async def create_request(payload: dict):
    # payload: full_name, contact, topic (user-selected), title, description
    new_id = len(mock_db.list_requests()) + 1
    assigned = classifier.classify(payload.get("description",""), payload.get("title",""))
    item = {
        "request_id": new_id,
        "full_name": payload.get("full_name"),
        "contact": payload.get("contact"),
        "topic": payload.get("topic"),
        "title": payload.get("title"),
        "description": payload.get("description"),
        "assigned_department": assigned,
        "status": "new",
        "created_at": datetime.utcnow().isoformat(),
        "response": None
    }
    mock_db.add_request(item)
    return {"request_id": new_id, "assigned_department": assigned, "status": "created"}

@router.get("/requests")
async def list_requests(topic: str = None, assigned_department: str = None, status: str = None, date_from: str = None, date_to: str = None):
    items = mock_db.list_requests()
    # простая фильтрация
    if topic:
        items = [i for i in items if i.get("topic") == topic]
    if assigned_department:
        items = [i for i in items if i.get("assigned_department") == assigned_department]
    if status:
        items = [i for i in items if i.get("status") == status]
    # date_from/date_to — строки ISO, для MVP можно пропустить проверку сложных форматов
    if date_from:
        items = [i for i in items if i.get("created_at") >= date_from]
    if date_to:
        items = [i for i in items if i.get("created_at") <= date_to]
    return {"items": items, "total": len(items)}

@router.get("/requests/{request_id}")
async def get_request(request_id: int):
    item = mock_db.get_request_by_id(request_id)
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item