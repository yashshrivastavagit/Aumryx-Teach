from fastapi import APIRouter, HTTPException, status, Depends, Query
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from typing import List, Optional
from datetime import datetime

from models.class_model import Class, ClassCreate, ClassUpdate, ClassStatus
from models.user import User
from dependencies import get_db, get_current_teacher, get_current_verified_teacher

router = APIRouter(prefix="/classes", tags=["Classes"])

async def get_db():
    from server import db
    return db



@router.get("", response_model=List[Class])
async def get_classes(
    teacher_id: Optional[str] = Query(None, description="Filter by teacher ID"),
    subject: Optional[str] = Query(None, description="Filter by subject"),
    status_filter: Optional[ClassStatus] = Query(None, alias="status", description="Filter by status")
):
    """Get all classes with optional filters."""
    
    query = {}
    
    if teacher_id:
        if not ObjectId.is_valid(teacher_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid teacher ID"
            )
        query["teacher_id"] = teacher_id
    
    if subject:
        query["subject"] = {"$regex": subject, "$options": "i"}
    
    if status_filter:
        query["status"] = status_filter.value
    else:
        query["status"] = ClassStatus.ACTIVE.value  # Default to active classes
    
    db = await get_db()
    
    classes = []
    async for class_doc in db.classes.find(query):
        class_doc["_id"] = str(class_doc["_id"])
        classes.append(Class(**class_doc))
    
    return classes

@router.post("", response_model=Class, status_code=status.HTTP_201_CREATED)
async def create_class(
    class_data: ClassCreate,
    current_teacher: User = Depends(get_current_verified_teacher)
):
    """Create a new class (verified teachers only)."""
    
    # Create class document
    class_dict = class_data.model_dump()
    class_dict["teacher_id"] = current_teacher.id
    class_dict["enrolled_students"] = 0
    class_dict["status"] = ClassStatus.ACTIVE.value
    class_dict["created_at"] = datetime.utcnow()
    class_dict["updated_at"] = datetime.utcnow()
    
    db = await get_db()
    
    # Insert class
    result = await db.classes.insert_one(class_dict)
    class_id = str(result.inserted_id)
    
    # Get created class
    created_class = await db.classes.find_one({"_id": result.inserted_id})
    created_class["_id"] = class_id
    return Class(**created_class)

@router.get("/{class_id}", response_model=Class)
async def get_class(class_id: str):
    """Get a single class by ID."""
    
    if not ObjectId.is_valid(class_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid class ID"
        )
    
    db = await get_db()
    
    class_doc = await db.classes.find_one({"_id": ObjectId(class_id)})
    
    if not class_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    class_doc["_id"] = str(class_doc["_id"])
    return Class(**class_doc)

@router.put("/{class_id}", response_model=Class)
async def update_class(
    class_id: str,
    update_data: ClassUpdate,
    current_teacher: User = Depends(get_current_teacher)
):
    """Update a class (only the class owner)."""
    
    if not ObjectId.is_valid(class_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid class ID"
        )
    
    # Check if class exists and belongs to teacher
    existing_class = await db.classes.find_one({"_id": ObjectId(class_id)})
    if not existing_class:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    if existing_class["teacher_id"] != current_teacher.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own classes"
        )
    
    # Build update document
    update_dict = update_data.model_dump(exclude_unset=True)
    if not update_dict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update"
        )
    
    update_dict["updated_at"] = datetime.utcnow()
    
    # Update class
    await db.classes.update_one(
        {"_id": ObjectId(class_id)},
        {"$set": update_dict}
    )
    
    # Get updated class
    updated_class = await db.classes.find_one({"_id": ObjectId(class_id)})
    updated_class["_id"] = str(updated_class["_id"])
    return Class(**updated_class)

@router.delete("/{class_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_class(
    class_id: str,
    current_teacher: User = Depends(get_current_teacher)
):
    """Delete a class (only the class owner)."""
    
    if not ObjectId.is_valid(class_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid class ID"
        )
    
    # Check if class exists and belongs to teacher
    existing_class = await db.classes.find_one({"_id": ObjectId(class_id)})
    if not existing_class:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    if existing_class["teacher_id"] != current_teacher.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own classes"
        )
    
    # Delete class
    await db.classes.delete_one({"_id": ObjectId(class_id)})
    
    return None