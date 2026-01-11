from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from typing import List
from datetime import datetime

from models.user import User

router = APIRouter(prefix="/admin", tags=["Admin"])

async def get_db():
    from server import db
    return db

@router.get("/teachers/pending", response_model=List[User])
async def get_pending_teachers():
    """Get all unverified teachers (admin only - no auth for MVP)."""
    
    db = await get_db()
    
    # Get unverified teachers
    teachers = []
    async for teacher in db.users.find({"user_type": "teacher", "verified": False}):
        teacher["_id"] = str(teacher["_id"])
        teachers.append(User(**teacher))
    
    return teachers

@router.get("/teachers/all", response_model=List[User])
async def get_all_teachers():
    """Get all teachers regardless of verification status (admin only)."""
    
    db = await get_db()
    
    teachers = []
    async for teacher in db.users.find({"user_type": "teacher"}):
        teacher["_id"] = str(teacher["_id"])
        teachers.append(User(**teacher))
    
    return teachers

@router.patch("/teachers/{teacher_id}/verify")
async def verify_teacher(teacher_id: str):
    """Verify a teacher (admin only - no auth for MVP)."""
    
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
    """Unverify a teacher (admin only - no auth for MVP)."""
    
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
