from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from typing import List
from datetime import date

from models.teacher_features import AttendanceRecord, AttendanceCreate, AttendanceStatus
from models.user import User
from dependencies import get_current_teacher

router = APIRouter(prefix="/attendance", tags=["Attendance"])

async def get_db():
    from server import db
    return db

@router.post("", response_model=AttendanceRecord, status_code=status.HTTP_201_CREATED)
async def mark_attendance(
    attendance_data: AttendanceCreate,
    current_teacher: User = Depends(get_current_teacher)
):
    """Mark attendance for a student (teachers only)."""
    
    db = await get_db()
    
    # Check if attendance already marked for this date
    existing = await db.attendance.find_one({
        "class_id": attendance_data.class_id,
        "student_id": attendance_data.student_id,
        "date": attendance_data.date.isoformat()
    })
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attendance already marked for this date"
        )
    
    # Create attendance record
    attendance_dict = attendance_data.model_dump()
    attendance_dict["date"] = attendance_data.date.isoformat()
    attendance_dict["created_by"] = current_teacher.id
    attendance_dict["created_at"] = attendance_data.model_fields["created_at"].default_factory()
    
    result = await db.attendance.insert_one(attendance_dict)
    attendance_id = str(result.inserted_id)
    
    created_attendance = await db.attendance.find_one({"_id": result.inserted_id})
    created_attendance["_id"] = attendance_id
    return AttendanceRecord(**created_attendance)

@router.get("/class/{class_id}", response_model=List[AttendanceRecord])
async def get_class_attendance(
    class_id: str,
    current_teacher: User = Depends(get_current_teacher)
):
    """Get all attendance records for a class."""
    
    db = await get_db()
    
    records = []
    async for record in db.attendance.find({"class_id": class_id}):
        record["_id"] = str(record["_id"])
        records.append(AttendanceRecord(**record))
    
    return records

@router.get("/student/{student_id}", response_model=List[AttendanceRecord])
async def get_student_attendance(student_id: str):
    """Get all attendance records for a student."""
    
    db = await get_db()
    
    records = []
    async for record in db.attendance.find({"student_id": student_id}):
        record["_id"] = str(record["_id"])
        records.append(AttendanceRecord(**record))
    
    return records