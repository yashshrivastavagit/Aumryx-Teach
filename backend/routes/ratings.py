from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from typing import List
from datetime import datetime

from models.retention_features import Rating, RatingCreate, TeacherAnalytics
from models.user import User
from dependencies import get_current_student, get_current_user

router = APIRouter(prefix="/ratings", tags=["Ratings"])

async def get_db():
    from server import db
    return db

@router.post("", response_model=Rating, status_code=status.HTTP_201_CREATED)
async def create_rating(
    rating_data: RatingCreate,
    current_student: User = Depends(get_current_student)
):
    """Create a rating for a teacher (students only)."""
    
    db = await get_db()
    
    # Check if student already rated this teacher for this class
    existing = await db.ratings.find_one({
        "student_id": current_student.id,
        "teacher_id": rating_data.teacher_id,
        "class_id": rating_data.class_id
    })
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already rated this teacher for this class"
        )
    
    rating_dict = rating_data.model_dump()
    rating_dict["student_id"] = current_student.id
    rating_dict["created_at"] = datetime.utcnow()
    
    result = await db.ratings.insert_one(rating_dict)
    rating_id = str(result.inserted_id)
    
    # Update teacher's average rating
    await update_teacher_rating(db, rating_data.teacher_id)
    
    created_rating = await db.ratings.find_one({"_id": result.inserted_id})
    created_rating["_id"] = rating_id
    return Rating(**created_rating)

@router.get("/teacher/{teacher_id}", response_model=List[Rating])
async def get_teacher_ratings(teacher_id: str):
    """Get all ratings for a teacher."""
    
    db = await get_db()
    
    ratings = []
    async for rating in db.ratings.find({"teacher_id": teacher_id}).sort("created_at", -1):
        rating["_id"] = str(rating["_id"])
        ratings.append(Rating(**rating))
    
    return ratings

async def update_teacher_rating(db, teacher_id: str):
    """Update teacher's average rating."""
    
    # Calculate average rating
    ratings = []
    async for rating in db.ratings.find({"teacher_id": teacher_id}):
        ratings.append(rating["rating"])
    
    if ratings:
        avg_rating = sum(ratings) / len(ratings)
        await db.users.update_one(
            {"_id": ObjectId(teacher_id)},
            {"$set": {"rating": round(avg_rating, 2)}}
        )