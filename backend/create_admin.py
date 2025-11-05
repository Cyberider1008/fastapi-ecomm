#!/usr/bin/env python3
"""
Script to create an admin user for the FastAPI application.
Usage:
    python backend/create_admin.py <email> <password> [name]
    
Example:
    python backend/create_admin.py admin@example.com secret123 "Admin User"
"""

import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.database import SessionLocal, init_db
from app.models import User
from app.auth import hash_password


def create_admin(email: str, password: str, name: str = "Admin") -> None:
    """Create an admin user in the database."""
    init_db()  # Ensure database tables exist
    db: Session = SessionLocal()
    
    try:
        # Check if user already exists
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            if existing.is_admin:
                print(f"User with email '{email}' already exists and is already an admin.")
                return
            else:
                # Upgrade existing user to admin
                existing.is_admin = True
                existing.is_active = True
                db.add(existing)
                db.commit()
                print(f"✅ Existing user '{email}' has been upgraded to admin.")
                return
        
        # Create new admin user
        user = User(
            name=name,
            email=email,
            hashed_password=hash_password(password),
            is_active=True,
            is_admin=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f" Admin user created successfully!")
        print(f"   Email: {email}")
        print(f"   Name: {name}")
        print(f"   ID: {user.id}")
        
    except Exception as e:
        db.rollback()
        print(f" Error creating admin user: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    
    email = sys.argv[1]
    password = sys.argv[2]
    name = sys.argv[3] if len(sys.argv) > 3 else "Admin"
    
    create_admin(email, password, name)

