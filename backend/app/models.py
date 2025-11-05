from sqlalchemy import Column, Integer, String, Boolean, Date
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    address = Column(String(500), nullable=True)
    contact_number = Column(String(50), nullable=True)
    dob = Column(Date, nullable=True)
    profile_photo_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)


