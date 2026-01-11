from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from datetime import datetime

from utils.auth import verify_password, create_access_token, get_password_hash
from dependencies import get_current_user
from models.user import User

router = APIRouter(prefix="/admin/auth", tags=["Admin Auth"])

# Admin credentials - In production, store securely in environment variables
ADMIN_EMAIL = "founder@aumryxteach.com"
ADMIN_PASSWORD_HASH = get_password_hash("aumryx_founder_2025_secure")  # Change this!

class AdminLogin(BaseModel):
    email: str
    password: str

class AdminToken(BaseModel):
    access_token: str
    token_type: str
    is_admin: bool

@router.post("/login", response_model=AdminToken)
async def admin_login(credentials: AdminLogin):
    """Admin login endpoint - founder only access."""
    
    # Verify admin credentials
    if credentials.email != ADMIN_EMAIL:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials"
        )
    
    if not verify_password(credentials.password, ADMIN_PASSWORD_HASH):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials"
        )
    
    # Create admin token with special claim
    access_token = create_access_token(
        data={
            "sub": "admin",
            "user_type": "admin",
            "is_admin": True
        }
    )
    
    return AdminToken(
        access_token=access_token,
        token_type="bearer",
        is_admin=True
    )

async def get_current_admin(current_user: User = Depends(get_current_user)):
    """Dependency to verify admin access."""
    # For admin, the user_id will be "admin"
    if current_user.id != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user
