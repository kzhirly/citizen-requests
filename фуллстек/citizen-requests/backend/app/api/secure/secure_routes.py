from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/profile")
async def get_profile(request: Request):
    return {"username": request.state.user}