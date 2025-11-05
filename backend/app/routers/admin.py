from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas import UserSafe, ToggleActiveRequest
from ..deps import require_admin


router = APIRouter()


@router.get("/users", response_model=list[UserSafe])
def list_users(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(User).order_by(User.id.desc()).all()


@router.patch("/users/{user_id}/toggle-active", response_model=UserSafe)
def toggle_active(
    user_id: int,
    payload: ToggleActiveRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = payload.is_active
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


