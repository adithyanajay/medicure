from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from auth import verify_access_token  # Import token verification function

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")  # Token authentication

@router.get("/protected-route")
async def protected_route(token: str = Depends(oauth2_scheme)):
    """Route protected by JWT authentication."""
    username = verify_access_token(token)
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"message": "You are authorized", "user": username}
