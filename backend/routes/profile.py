from fastapi import APIRouter, HTTPException, status, Depends, File, UploadFile
from bson import ObjectId
from typing import Optional
from datetime import datetime
import base64

from models.user import User, UserUpdate
from models.retention_features import ProfilePictureUpdate
from dependencies import get_current_user, get_current_teacher

router = APIRouter(prefix="/profile", tags=["Profile"])

async def get_db():
    from server import db
    return db

@router.put("/picture", response_model=User)
async def update_profile_picture(
    profile_data: ProfilePictureUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update user profile picture."""
    
    db = await get_db()
    
    result = await db.users.update_one(
        {"_id": ObjectId(current_user.id)},
        {"$set": {
            "image_url": profile_data.image_url,
            "updated_at": datetime.utcnow()
        }}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    updated_user = await db.users.find_one({"_id": ObjectId(current_user.id)})
    updated_user["_id"] = str(updated_user["_id"])
    return User(**updated_user)

@router.put("/teacher/rate", response_model=User)
async def update_teacher_rate(
    hourly_rate: float,
    current_teacher: User = Depends(get_current_teacher)
):
    """Update teacher hourly rate."""
    
    db = await get_db()
    
    if hourly_rate < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hourly rate must be positive"
        )
    
    result = await db.users.update_one(
        {"_id": ObjectId(current_teacher.id)},
        {"$set": {
            "hourly_rate": hourly_rate,
            "updated_at": datetime.utcnow()
        }}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher not found"
        )
    
    updated_teacher = await db.users.find_one({"_id": ObjectId(current_teacher.id)})
    updated_teacher["_id"] = str(updated_teacher["_id"])
    return User(**updated_teacher)