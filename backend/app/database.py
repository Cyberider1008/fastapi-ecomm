from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.pool import StaticPool
import os


DB_PATH = os.getenv("DATABASE_URL", "sqlite:///backend/data.db")


class Base(DeclarativeBase):
    pass


def get_engine():
    if DB_PATH.startswith("sqlite"): 
        # SQLite needs check_same_thread disabled for FastAPI usage
        return create_engine(
            DB_PATH,
            connect_args={"check_same_thread": False} if "///" in DB_PATH else {},
            poolclass=StaticPool if DB_PATH == "sqlite://" else None,
        )
    return create_engine(DB_PATH)


engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db() -> None:
    from . import models  # noqa: F401
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


