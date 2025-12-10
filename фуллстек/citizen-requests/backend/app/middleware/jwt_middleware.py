from fastapi import Request, HTTPException
from jose import jwt

SECRET = "SUPERSECRET"
ALGO = "HS256"

async def verify_token(request: Request, call_next):
    if request.url.path.startswith("/api/secure"):
        token = request.headers.get("Authorization")
        if not token:
            raise HTTPException(status_code=401, detail="Missing token")

        token = token.replace("Bearer ", "")
        try:
            jwt.decode(token, SECRET, algorithms=[ALGO])
        except:
            raise HTTPException(status_code=401, detail="Invalid token")

    return await call_next(request)