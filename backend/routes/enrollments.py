from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from typing import List
from datetime import datetime

from models.enrollment import Enrollment, EnrollmentCreate, EnrollmentStatus, PaymentStatus
from models.user import User
from dependencies import get_db, get_current_student, get_current_user

router = APIRouter(prefix="/enrollments", tags=["Enrollments"])

async def get_db():
    from server import db
    return db



@router.post("", response_model=Enrollment, status_code=status.HTTP_201_CREATED)
async def create_enrollment(
    enrollment_data: EnrollmentCreate,
    current_student: User = Depends(get_current_student)
):
    """Enroll in a class (students only)."""
    
    
    db = await get_db()
    # Validate class ID
    if not ObjectId.is_valid(enrollment_data.class_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid class ID"
        )
    
    # Get class details
    class_doc = await db.classes.find_one({"_id": ObjectId(enrollment_data.class_id)})
    if not class_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    # Check if class is full
    if class_doc["enrolled_students"] >= class_doc["max_students"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Class is full"
        )
    
    # Check if already enrolled
    existing_enrollment = await db.enrollments.find_one({
        "student_id": current_student.id,
        "class_id": enrollment_data.class_id,
        "status": EnrollmentStatus.ACTIVE.value
    })
    
    if existing_enrollment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already enrolled in this class"
        )
    
    # Create enrollment
    enrollment_dict = {
        "student_id": current_student.id,
        "class_id": enrollment_data.class_id,
        "teacher_id": class_doc["teacher_id"],
        "amount": class_doc["price"],
        "enrolled_date": datetime.utcnow(),
        "status": EnrollmentStatus.ACTIVE.value,
        "payment_status": PaymentStatus.PAID.value,  # Mock payment as paid
        "payment_intent_id": None
    }
    
    # Insert enrollment
    result = await db.enrollments.insert_one(enrollment_dict)
    enrollment_id = str(result.inserted_id)
    
    # Update class enrolled_students count
    await db.classes.update_one(
        {"_id": ObjectId(enrollment_data.class_id)},
        {"$inc": {"enrolled_students": 1}}
    )
    
    # Update teacher students_count
    await db.users.update_one(
        {"_id": ObjectId(class_doc["teacher_id"])},
        {"$inc": {"students_count": 1}}
    )
    
    # Get created enrollment
    created_enrollment = await db.enrollments.find_one({"_id": result.inserted_id})
    created_enrollment["_id"] = enrollment_id
    return Enrollment(**created_enrollment)

@router.get("/student/{student_id}", response_model=List[Enrollment])
async def get_student_enrollments(
    student_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get all enrollments for a student."""
    
    # Students can only view their own enrollments
    if current_user.user_type == "student" and current_user.id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own enrollments"
        )
    
    if not ObjectId.is_valid(student_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid student ID"
        )
    
    enrollments = []
    async for enrollment in db.enrollments.find({"student_id": student_id}):
        enrollment["_id"] = str(enrollment["_id"])
        enrollments.append(Enrollment(**enrollment))
    
    return enrollments

@router.get("/teacher/{teacher_id}", response_model=List[Enrollment])
async def get_teacher_enrollments(
    teacher_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get all enrollments for a teacher's classes."""
    
    # Teachers can only view their own enrollments
    if current_user.user_type == "teacher" and current_user.id != teacher_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own enrollments"
        )
    
    if not ObjectId.is_valid(teacher_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid teacher ID"
        )
    
    enrollments = []
    async for enrollment in db.enrollments.find({"teacher_id": teacher_id}):
        enrollment["_id"] = str(enrollment["_id"])
        enrollments.append(Enrollment(**enrollment))
    
    return enrollments

@router.get("/{enrollment_id}", response_model=Enrollment)
async def get_enrollment(
    enrollment_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a single enrollment by ID."""
    
    if not ObjectId.is_valid(enrollment_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid enrollment ID"
        )
    
    enrollment = await db.enrollments.find_one({"_id": ObjectId(enrollment_id)})
    
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enrollment not found"
        )
    
    # Verify access
    if current_user.id not in [enrollment["student_id"], enrollment["teacher_id"]]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this enrollment"
        )
    
    enrollment["_id"] = str(enrollment["_id"])
    return Enrollment(**enrollment)