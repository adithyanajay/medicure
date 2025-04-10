from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    specialization = Column(String)
    experience = Column(String)
    rating = Column(Float)
    patients = Column(Integer)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    image_url = Column(String, nullable=True)
    expertise = Column(JSON)  # List of expertise areas
    available_days = Column(JSON)  # List of available days
    available_time_slots = Column(JSON)  # List of available time slots
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class User(BaseModel):
    username: str
    email: EmailStr
    password: str
    reset_token: Optional[str] = None


class UserProfile(BaseModel):
    user_id: str  # Links to AuthUser ID
    username: str
    dob: str
    blood_group: str
    height: str
    weight: str