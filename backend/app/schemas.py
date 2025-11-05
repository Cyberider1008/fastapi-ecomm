from datetime import date
from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserBase(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    address: Optional[str] = None
    contact_number: Optional[str] = None
    dob: Optional[date] = None


class UserCreate(UserBase):
    password: str = Field(min_length=6, max_length=128)


class UserUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    contact_number: Optional[str] = None
    dob: Optional[date] = None


class UserSafe(BaseModel):
    id: int
    name: str
    email: EmailStr
    address: Optional[str]
    contact_number: Optional[str]
    dob: Optional[date]
    profile_photo_url: Optional[str]
    is_active: bool
    is_admin: bool

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ToggleActiveRequest(BaseModel):
    is_active: bool


