from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class TokenData(BaseModel):
    access_token: str
    token_type: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class UserProfile(BaseModel):
    dob: str  # Format: YYYY-MM-DD
    blood_group: str
    height: str  # Format: "175 cm"
    weight: str  # Format: "70 kg"

class DoctorBase(BaseModel):
    name: str
    specialization: str
    experience: str
    rating: float = Field(ge=0, le=5)
    patients: int
    email: EmailStr
    phone: str
    image_url: Optional[str] = None
    expertise: List[str] = []
    available_days: List[str] = []
    available_time_slots: List[str] = []

class DoctorCreate(DoctorBase):
    pass

class Doctor(DoctorBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    specialization: Optional[str] = None
    experience: Optional[str] = None
    rating: Optional[float] = None
    patients: Optional[int] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    image_url: Optional[str] = None
    expertise: Optional[List[str]] = None
    available_days: Optional[List[str]] = None
    available_time_slots: Optional[List[str]] = None