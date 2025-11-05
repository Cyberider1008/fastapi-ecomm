from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi import status
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import os
import uuid

from ..database import get_db
from ..models import User
from ..schemas import LoginRequest, Token
from ..auth import verify_password, create_access_token, hash_password


router = APIRouter()


@router.post("/login", response_model=Token)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is inactive")
    token = create_access_token(user.email)
    return Token(access_token=token)


@router.post("/register", status_code=201)
async def register(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    address: Optional[str] = Form(None),
    contact_number: Optional[str] = Form(None),
    dob: Optional[str] = Form(None),  # ISO date
    profile_photo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    photo_url: Optional[str] = None
    if profile_photo is not None:
        os.makedirs("backend/uploads", exist_ok=True)
        ext = os.path.splitext(profile_photo.filename or "")[1] or ".jpg"
        file_id = f"{uuid.uuid4().hex}{ext}"
        save_path = os.path.join("backend/uploads", file_id)
        with open(save_path, "wb") as f:
            f.write(await profile_photo.read())
        photo_url = f"/uploads/{file_id}"

    parsed_dob = None
    if dob:
        try:
            parsed_dob = datetime.fromisoformat(dob).date()
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid date format. Use ISO yyyy-mm-dd")

    user = User(
        name=name,
        email=email,
        hashed_password=hash_password(password),
        address=address,
        contact_number=contact_number,
        dob=parsed_dob,
        profile_photo_url=photo_url,
        is_active=True,
        is_admin=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"id": user.id}


