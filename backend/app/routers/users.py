from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
import os
import uuid

from ..database import get_db
from ..models import User
from ..schemas import UserSafe, UserUpdate
from ..deps import get_current_user


router = APIRouter()


@router.get("/me", response_model=UserSafe)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserSafe)
def update_me(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.name is not None:
        current_user.name = payload.name
    if payload.address is not None:
        current_user.address = payload.address
    if payload.contact_number is not None:
        current_user.contact_number = payload.contact_number
    if payload.dob is not None:
        current_user.dob = payload.dob
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/me/photo", response_model=UserSafe)
async def upload_my_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    os.makedirs("backend/uploads", exist_ok=True)
    ext = os.path.splitext(file.filename or "")[1] or ".jpg"
    file_id = f"{uuid.uuid4().hex}{ext}"
    save_path = os.path.join("backend/uploads", file_id)
    with open(save_path, "wb") as f:
        f.write(await file.read())
    current_user.profile_photo_url = f"/uploads/{file_id}"
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


