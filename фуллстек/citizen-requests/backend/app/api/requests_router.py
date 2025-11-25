from fastapi import APIRouter, HTTPException
from app.db import crud
from app.services import classifier
from datetime import datetime

router = APIRouter()


# ------------------ CREATE ------------------

@router.post("/requests")
async def create_request(payload: dict):
    new_id = len(crud.list_requests()) + 1

    assigned = classifier.classify(
        payload.get("description", ""),
        payload.get("title", "")
    )

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

    crud.add_request(item)
    return {"request_id": new_id, "assigned_department": assigned, "status": "created"}


# ------------------ READ LIST ------------------

@router.get("/requests")
async def list_requests(topic: str = None, assigned_department: str = None,
                        status: str = None, date_from: str = None, date_to: str = None):
    items = crud.list_requests()

    if topic:
        items = [i for i in items if i.get("topic") == topic]
    if assigned_department:
        items = [i for i in items if i.get("assigned_department") == assigned_department]
    if status:
        items = [i for i in items if i.get("status") == status]
    if date_from:
        items = [i for i in items if i.get("created_at") >= date_from]
    if date_to:
        items = [i for i in items if i.get("created_at") <= date_to]

    return {"items": items, "total": len(items)}


# ------------------ READ ONE ------------------

@router.get("/requests/{request_id}")
async def get_request(request_id: int):
    item = crud.get_request_by_id(request_id)
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item


# ------------------ UPDATE ------------------

@router.put("/requests/{request_id}")
async def update_request(request_id: int, payload: dict):
    allowed = {"status", "response"}

    # фильтруем только разрешённые ключи
    updates = {key: value for key, value in payload.items() if key in allowed}

    if not updates:
        raise HTTPException(status_code=400, detail="Nothing to update")

    item = crud.update_request(request_id, updates)

    if not item:
        raise HTTPException(status_code=404, detail="Not found")

    return {"updated": item}


# ------------------ DELETE ------------------

@router.delete("/requests/{request_id}")
async def remove_request(request_id: int):
    deleted = crud.delete_request(request_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Not found")

    return {"deleted": True, "request_id": request_id}