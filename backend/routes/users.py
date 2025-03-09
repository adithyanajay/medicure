from fastapi import APIRouter, Depends, HTTPException
from auth import create_access_token, hash_password, verify_password, get_current_user
from database import get_user_collection, get_user_profile_collection
from schemas import UserCreate, UserLogin, TokenData, UserProfile

router = APIRouter()

@router.post("/signup", response_model=TokenData)
async def signup(user_data: UserCreate):
    users = await get_user_collection()

    existing_user = await users.find_one({"username": user_data.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_pw = hash_password(user_data.password)
    new_user = {
        "username": user_data.username,
        "email": user_data.email,
        "password": hashed_pw
    }
    user_result = await users.insert_one(new_user)

    # Generate JWT token after signup
    token = create_access_token({"user_id": str(user_result.inserted_id)})

    return {"access_token": token, "token_type": "bearer", "user_id": str(user_result.inserted_id)}

@router.post("/login", response_model=TokenData)
async def login(user_data: UserLogin):
    users = await get_user_collection()
    user = await users.find_one({"username": user_data.username})

    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"user_id": str(user["_id"])})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/user/profile")
async def create_user_profile(user_profile: UserProfile, current_user: dict = Depends(get_current_user)):
    user_profiles = await get_user_profile_collection()
   
    existing_profile = await user_profiles.find_one({"user_id": current_user["user_id"]})
    if existing_profile:
        raise HTTPException(status_code=400, detail="User profile already exists")

    profile_data = user_profile.dict()
    profile_data["user_id"] = current_user["user_id"] 
    await user_profiles.insert_one(profile_data)
    return {"message": "User profile created successfully"}



@router.get("/auth/me")
async def get_user_data(current_user: dict = Depends(get_current_user)):
    return {"email": current_user["email"], "id": str(current_user["_id"])}






# @router.post("/forgot-password")
# async def forgot_password(request: ForgotPasswordRequest):
#     users = await get_user_collection()
#     user = await users.find_one({"email": request.email})

#     if not user:
#         raise HTTPException(status_code=404, detail="Email not registered")

#     reset_token = "".join(random.choices(string.ascii_letters + string.digits, k=20))
#     await users.update_one({"email": request.email}, {"$set": {"reset_token": reset_token}})
    
#     send_reset_email(request.email, reset_token)
#     return {"message": "Password reset email sent"}

# @router.post("/reset-password")
# async def reset_password(request: ResetPasswordRequest):
#     users = await get_user_collection()
#     user = await users.find_one({"reset_token": request.token})

#     if not user:
#         raise HTTPException(status_code=400, detail="Invalid reset token")

#     new_hashed_pw = hash_password(request.new_password)
#     await users.update_one({"reset_token": request.token}, {"$set": {"password": new_hashed_pw, "reset_token": None}})
    
#     return {"message": "Password reset successful"}
