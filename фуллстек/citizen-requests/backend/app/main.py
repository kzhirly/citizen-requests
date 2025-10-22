from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import health, auth, requests_router

app = FastAPI(title="Citizen Requests API (MVP)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(requests_router.router, prefix="/api")