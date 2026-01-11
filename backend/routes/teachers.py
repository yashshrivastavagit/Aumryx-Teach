from fastapi import APIRouter, HTTPException, status, Depends, Query
from bson import ObjectId
from typing import List, Optional
from datetime import datetime

from models.user import User, UserUpdate
from dependencies import get_current_user, get_current_teacher

router = APIRouter(prefix="/teachers", tags=["Teachers"])

async def get_db():
    from server import db
    return db

@router.get("", response_model=List[User])
async def get_teachers(
    search: Optional[str] = Query(None, description="Search by name or subject"),
    subject: Optional[str] = Query(None, description="Filter by subject"),
    verified_only: bool = Query(True, description="Show only verified teachers")
):
    """Get all teachers with optional search and filters."""
    
    db = await get_db()
    
    # Build query
    query = {"user_type": "teacher"}
    
    if verified_only:
        query["verified"] = True
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"subjects": {"$regex": search, "$options": "i"}}
        ]
    
    if subject:
        query["subjects"] = subject
    
    # Get teachers
    teachers = []
    async for teacher in db.users.find(query):
        teacher["_id"] = str(teacher["_id"])
        teachers.append(User(**teacher))
    
    return teachers

@router.get("/{teacher_id}", response_model=User)
async def get_teacher(teacher_id: str):
    """Get a single teacher by ID."""
    
    db = await get_db()
    
    if not ObjectId.is_valid(teacher_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid teacher ID"
        )
    
    teacher = await db.users.find_one({
        "_id": ObjectId(teacher_id),
        "user_type": "teacher"
    })
    
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher not found"
        )
    
    teacher["_id"] = str(teacher["_id"])
    return User(**teacher)

@router.put("/{teacher_id}", response_model=User)
async def update_teacher(
    teacher_id: str,
    update_data: UserUpdate,
    current_user: User = Depends(get_current_teacher)
):
    """Update teacher profile (only the teacher themselves)."""
    
    db = await get_db()
    
    # Verify the teacher is updating their own profile
    if current_user.id != teacher_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own profile"
        )
    
    # Build update document
    update_dict = update_data.model_dump(exclude_unset=True)
    if not update_dict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update"
        )
    
    update_dict["updated_at"] = datetime.utcnow()
    
    # Update teacher
    result = await db.users.update_one(
        {"_id": ObjectId(teacher_id)},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher not found"
        )
    
    # Get updated teacher
    updated_teacher = await db.users.find_one({"_id": ObjectId(teacher_id)})
    updated_teacher["_id"] = str(updated_teacher["_id"])
    return User(**updated_teacher)