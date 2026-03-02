from fastapi import APIRouter, Depends
from app.db.database import get_session
from app.db import crud
from app.api.deps import role_required

router = APIRouter()

@router.get("/requests")
def list_requests(user=Depends(role_required(["guest","user","manager","admin"])), db=Depends(get_session)):
    return crud.get_all_requests(db)

@router.post("/requests")
def create_request(payload: dict, user=Depends(role_required(["user","manager","admin"])), db=Depends(get_session)):
    payload["full_name"] = user["username"]
    return crud.create_request(db, payload)

@router.put("/requests/{id}")
def edit_request(id: int, payload: dict, user=Depends(role_required(["user","manager","admin"])), db=Depends(get_session)):
    return crud.update_request(db, id, payload, user)

@router.patch("/requests/{id}/close")
def close_request(id: int, user=Depends(role_required(["manager","admin"])), db=Depends(get_session)):
    return crud.close_request(db, id)