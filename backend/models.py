from pydantic import BaseModel, EmailStr
from typing import Optional

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