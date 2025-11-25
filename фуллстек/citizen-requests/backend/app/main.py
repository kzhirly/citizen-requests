from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import health, auth, requests_router

app = FastAPI(title="Citizen Requests API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(requests_router.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "API работает!"}