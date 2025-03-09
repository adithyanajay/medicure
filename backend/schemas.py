from pydantic import BaseModel, EmailStr

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