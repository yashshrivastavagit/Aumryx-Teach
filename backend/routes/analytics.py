from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from typing import Dict

from models.retention_features import TeacherAnalytics, StudentAnalytics
from models.user import User
from dependencies import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

async def get_db():
    from server import db
    return db

@router.get("/teacher/{teacher_id}", response_model=TeacherAnalytics)
async def get_teacher_analytics(
    teacher_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get analytics for a teacher."""
    
    db = await get_db()
    
    # Get teacher
    teacher = await db.users.find_one({"_id": ObjectId(teacher_id), "user_type": "teacher"})
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher not found"
        )
    
    # Calculate analytics
    total_classes = await db.classes.count_documents({"teacher_id": teacher_id})
    total_enrollments = await db.enrollments.count_documents({"teacher_id": teacher_id, "status": "active"})
    
    # Calculate total revenue
    total_revenue = 0.0
    async for enrollment in db.enrollments.find({"teacher_id": teacher_id, "payment_status": "paid"}):
        total_revenue += enrollment.get("amount", 0)
    
    # Get ratings
    ratings = []
    async for rating in db.ratings.find({"teacher_id": teacher_id}):
        ratings.append(rating["rating"])
    
    avg_rating = sum(ratings) / len(ratings) if ratings else 0.0
    
    analytics = TeacherAnalytics(
        teacher_id=teacher_id,
        total_students=teacher.get("students_count", 0),
        total_classes=total_classes,
        total_revenue=total_revenue,
        average_rating=round(avg_rating, 2),
        total_reviews=len(ratings),
        classes_completed=0,
        active_enrollments=total_enrollments,
        course_views=0
    )
    
    return analytics

@router.get("/student/{student_id}", response_model=StudentAnalytics)
async def get_student_analytics(
    student_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get analytics for a student."""
    
    db = await get_db()
    
    # Get student
    student = await db.users.find_one({"_id": ObjectId(student_id), "user_type": "student"})
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Calculate analytics
    total_enrolled = await db.enrollments.count_documents({"student_id": student_id})
    
    analytics = StudentAnalytics(
        student_id=student_id,
        total_courses_enrolled=total_enrolled,
        courses_completed=0,
        total_assignments_submitted=0,
        average_score=0.0,
        total_hours_learned=0.0,
        certificates_earned=0,
        current_streak=0
    )
    
    return analytics

@router.get("/earnings/{teacher_id}")
async def get_earnings_breakdown(
    teacher_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get detailed earnings breakdown for a teacher."""
    
    db = await get_db()
    
    # Verify teacher
    if current_user.id != teacher_id and current_user.user_type != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view these earnings"
        )
    
    # Get all paid enrollments
    enrollments = []
    total_earnings = 0.0
    
    async for enrollment in db.enrollments.find({
        "teacher_id": teacher_id,
        "payment_status": "paid"
    }):
        amount = enrollment.get("amount", 0)
        total_earnings += amount
        
        # Get class details
        class_doc = await db.classes.find_one({"_id": ObjectId(enrollment["class_id"])})
        
        enrollments.append({
            "enrollment_id": str(enrollment["_id"]),
            "class_title": class_doc.get("title", "Unknown") if class_doc else "Unknown",
            "amount": amount,
            "date": enrollment.get("enrolled_date"),
            "status": enrollment.get("payment_status")
        })
    
    # Calculate platform fee (10%)
    platform_fee = total_earnings * 0.10
    net_earnings = total_earnings - platform_fee
    
    return {
        "total_earnings": total_earnings,
        "platform_fee": platform_fee,
        "net_earnings": net_earnings,
        "total_transactions": len(enrollments),
        "recent_enrollments": enrollments[:10]
    }