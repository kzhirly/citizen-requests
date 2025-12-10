from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import health, auth, requests_router
from app.db.database import create_db_and_tables
from app.api.secure.secure_routes import router as secure_router
from app.middleware.jwt_middleware import verify_token


app = FastAPI(title="Citizen Requests API")

app.middleware("http")(verify_token)
create_db_and_tables()

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
app.include_router(secure_router, prefix="/api/secure")


@app.get("/")
def root():
    return {"message": "API работает!"}