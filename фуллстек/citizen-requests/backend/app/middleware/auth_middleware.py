from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse
from app.security.jwt_handler import verify_token


class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        path = request.url.path

        # Проверяем только защищённые пути
        if path.startswith("/api/secure"):
            auth_header = request.headers.get("Authorization")

            if not auth_header or not auth_header.startswith("Bearer "):
                return JSONResponse({"error": "Token required"}, status_code=401)

            token = auth_header.split(" ")[1]
            decoded = verify_token(token)

            if not decoded:
                return JSONResponse({"error": "Invalid or expired token"}, status_code=401)

            # кладём user в request.state
            request.state.user = decoded.get("sub")

        return await call_next(request)