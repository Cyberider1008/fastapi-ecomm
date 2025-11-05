import os
from sqlalchemy.orm import Session
from .models import User
from .auth import hash_password


def ensure_admin(db: Session) -> None:
    email = os.getenv("ADMIN_EMAIL")
    password = os.getenv("ADMIN_PASSWORD")
    if not email or not password:
        return
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        if not existing.is_admin:
            existing.is_admin = True
            existing.is_active = True
            db.add(existing)
            db.commit()
        return
    user = User(
        name="Admin",
        email=email,
        hashed_password=hash_password(password),
        is_active=True,
        is_admin=True,
    )
    db.add(user)
    db.commit()

