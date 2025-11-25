from fastapi import APIRouter, HTTPException
from app.models.auth_models import RegisterModel, LoginModel, TokenResponse
from app.db import crud
from app.services.auth_service import hash_password, verify_password, create_access_token

router = APIRouter()

@router.post("/register")
async def register(data: RegisterModel):
    user = crud.find_user(data.username)
    if user:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")

    hashed = hash_password(data.password)

    new_user = {
        "id": len(crud._store["users"]) + 1,
        "username": data.username,
        "password": hashed,
    }

    crud.add_user(new_user)
    return {"message": "Регистрация успешна"}

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginModel):
    user = crud.find_user(data.username)
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Неверный пароль")

    token = create_access_token({"sub": user["username"]})

    return TokenResponse(access_token=token)