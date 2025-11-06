from fastapi import APIRouter, Depends


from ..models import User
from ..schemas import UserSafe
from ..deps import get_current_user


router = APIRouter()


@router.get("/me", response_model=UserSafe)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
