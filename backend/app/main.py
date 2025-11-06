from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from .database import init_db
from .database import SessionLocal
from .routers import auth as auth_router
from .routers import users as users_router
from .routers import admin as admin_router



def create_app() -> FastAPI:
    app = FastAPI(title="E-Com API", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Ensure uploads directory exists then mount static files
    os.makedirs("backend/uploads", exist_ok=True)
    app.mount("/uploads", StaticFiles(directory="backend/uploads"), name="uploads")

    # Routers
    app.include_router(auth_router.router, prefix="/api/auth", tags=["auth"])
    app.include_router(users_router.router, prefix="/api/users", tags=["users"])
    app.include_router(admin_router.router, prefix="/api/admin", tags=["admin"])

    return app


app = create_app()


@app.on_event("startup")
def on_startup() -> None:
    init_db()
   

@app.get("/")
def root():
    return {"status": "ok", "message": "E-Com API running", "docs": "/docs"}


