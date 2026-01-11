from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from bson import ObjectId

from utils.auth import decode_access_token
from models.user import User, UserType

security = HTTPBearer()

async def get_db():
    """Get database connection from server.py"""
    from server import db
    return db

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Get the current authenticated user."""
    token = credentials.credentials
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = decode_access_token(token)
    if token_data is None or token_data.user_id is None:
        raise credentials_exception
    
    # Get user from database
    db = await get_db()
    user_dict = await db.users.find_one({"_id": ObjectId(token_data.user_id)})
    if user_dict is None:
        raise credentials_exception
    
    user_dict["_id"] = str(user_dict["_id"])
    return User(**user_dict)

async def get_current_teacher(current_user: User = Depends(get_current_user)) -> User:
    """Get the current authenticated teacher."""
    if current_user.user_type != UserType.TEACHER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers can access this resource"
        )
    return current_user

async def get_current_student(current_user: User = Depends(get_current_user)) -> User:
    """Get the current authenticated student."""
    if current_user.user_type != UserType.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can access this resource"
        )
    return current_user

async def get_current_verified_teacher(current_user: User = Depends(get_current_teacher)) -> User:
    """Get the current authenticated and verified teacher."""
    if not current_user.verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Teacher account is not verified yet"
        )
    return current_user