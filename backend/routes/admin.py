from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from typing import List
from datetime import datetime
import os

from models.user import User
from dependencies import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin"])

# Founder email from environment
FOUNDER_EMAIL = os.environ.get("FOUNDER_EMAIL", "aumryx@gmail.com")

async def get_db():
    from server import db
    return db

async def verify_founder_access(current_user: User = Depends(get_current_user)):
    """Verify that the current user is the founder."""
    if current_user.email != FOUNDER_EMAIL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Only the founder can access admin features."
        )
    return current_user

@router.get("/teachers/pending", response_model=List[User])
async def get_pending_teachers(founder: User = Depends(verify_founder_access)):
    """Get all unverified teachers."""
    
    db = await get_db()
    
    # Get unverified teachers
    teachers = []
    async for teacher in db.users.find({"user_type": "teacher", "verified": False}):
        teacher["_id"] = str(teacher["_id"])
        teachers.append(User(**teacher))
    
    return teachers

@router.get("/teachers/all", response_model=List[User])
async def get_all_teachers():
    """Get all teachers regardless of verification status."""
    
    db = await get_db()
    
    teachers = []
    async for teacher in db.users.find({"user_type": "teacher"}):
        teacher["_id"] = str(teacher["_id"])
        teachers.append(User(**teacher))
    
    return teachers

@router.patch("/teachers/{teacher_id}/verify")
async def verify_teacher(teacher_id: str):
    """Verify a teacher."""
    
    db = await get_db()
    
    if not ObjectId.is_valid(teacher_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid teacher ID"
        )
    
    # Check if teacher exists
    teacher = await db.users.find_one({
        "_id": ObjectId(teacher_id),
        "user_type": "teacher"
    })
    
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher not found"
        )
    
    # Verify teacher
    result = await db.users.update_one(
        {"_id": ObjectId(teacher_id)},
        {
            "$set": {
                "verified": True,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Teacher is already verified"
        )
    
    return {"message": "Teacher verified successfully", "teacher_id": teacher_id}

@router.patch("/teachers/{teacher_id}/unverify")
async def unverify_teacher(teacher_id: str):
    """Unverify a teacher."""
    
    db = await get_db()
    
    if not ObjectId.is_valid(teacher_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid teacher ID"
        )
    
    # Unverify teacher
    result = await db.users.update_one(
        {"_id": ObjectId(teacher_id), "user_type": "teacher"},
        {
            "$set": {
                "verified": False,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher not found"
        )
    
    return {"message": "Teacher unverified successfully", "teacher_id": teacher_id}
