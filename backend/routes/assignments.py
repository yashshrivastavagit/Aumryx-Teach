from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from typing import List
from datetime import datetime

from models.teacher_features import Assignment, AssignmentCreate, AssignmentUpdate
from models.user import User
from dependencies import get_current_teacher

router = APIRouter(prefix="/assignments", tags=["Assignments"])

async def get_db():
    from server import db
    return db

@router.post("", response_model=Assignment, status_code=status.HTTP_201_CREATED)
async def create_assignment(
    assignment_data: AssignmentCreate,
    current_teacher: User = Depends(get_current_teacher)
):
    """Create an assignment (teachers only)."""
    
    db = await get_db()
    
    assignment_dict = assignment_data.model_dump()
    assignment_dict["teacher_id"] = current_teacher.id
    assignment_dict["created_at"] = datetime.utcnow()
    assignment_dict["updated_at"] = datetime.utcnow()
    
    result = await db.assignments.insert_one(assignment_dict)
    assignment_id = str(result.inserted_id)
    
    created_assignment = await db.assignments.find_one({"_id": result.inserted_id})
    created_assignment["_id"] = assignment_id
    return Assignment(**created_assignment)

@router.get("/class/{class_id}", response_model=List[Assignment])
async def get_class_assignments(class_id: str):
    """Get all assignments for a class."""
    
    db = await get_db()
    
    assignments = []
    async for assignment in db.assignments.find({"class_id": class_id}).sort("created_at", -1):
        assignment["_id"] = str(assignment["_id"])
        assignments.append(Assignment(**assignment))
    
    return assignments

@router.get("/teacher/{teacher_id}", response_model=List[Assignment])
async def get_teacher_assignments(teacher_id: str):
    """Get all assignments by a teacher."""
    
    db = await get_db()
    
    assignments = []
    async for assignment in db.assignments.find({"teacher_id": teacher_id}).sort("created_at", -1):
        assignment["_id"] = str(assignment["_id"])
        assignments.append(Assignment(**assignment))
    
    return assignments

@router.put("/{assignment_id}", response_model=Assignment)
async def update_assignment(
    assignment_id: str,
    assignment_data: AssignmentUpdate,
    current_teacher: User = Depends(get_current_teacher)
):
    """Update an assignment (only by creator)."""
    
    db = await get_db()
    
    if not ObjectId.is_valid(assignment_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid assignment ID"
        )
    
    # Check ownership
    existing = await db.assignments.find_one({"_id": ObjectId(assignment_id)})
    if not existing or existing["teacher_id"] != current_teacher.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this assignment"
        )
    
    update_dict = assignment_data.model_dump(exclude_unset=True)
    update_dict["updated_at"] = datetime.utcnow()
    
    await db.assignments.update_one(
        {"_id": ObjectId(assignment_id)},
        {"$set": update_dict}
    )
    
    updated = await db.assignments.find_one({"_id": ObjectId(assignment_id)})
    updated["_id"] = str(updated["_id"])
    return Assignment(**updated)

@router.delete("/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_assignment(
    assignment_id: str,
    current_teacher: User = Depends(get_current_teacher)
):
    """Delete an assignment (only by creator)."""
    
    db = await get_db()
    
    if not ObjectId.is_valid(assignment_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid assignment ID"
        )
    
    # Check ownership
    existing = await db.assignments.find_one({"_id": ObjectId(assignment_id)})
    if not existing or existing["teacher_id"] != current_teacher.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this assignment"
        )
    
    await db.assignments.delete_one({"_id": ObjectId(assignment_id)})
    return None