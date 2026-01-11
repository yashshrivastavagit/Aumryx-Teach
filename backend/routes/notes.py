from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from typing import List, Optional
from datetime import datetime

from models.teacher_features import Note, NoteCreate, NoteUpdate
from models.user import User
from dependencies import get_current_teacher

router = APIRouter(prefix="/notes", tags=["Notes"])

async def get_db():
    from server import db
    return db

@router.post("", response_model=Note, status_code=status.HTTP_201_CREATED)
async def create_note(
    note_data: NoteCreate,
    current_teacher: User = Depends(get_current_teacher)
):
    """Create a note (teachers only)."""
    
    db = await get_db()
    
    note_dict = note_data.model_dump()
    note_dict["teacher_id"] = current_teacher.id
    note_dict["created_at"] = datetime.utcnow()
    note_dict["updated_at"] = datetime.utcnow()
    
    result = await db.notes.insert_one(note_dict)
    note_id = str(result.inserted_id)
    
    created_note = await db.notes.find_one({"_id": result.inserted_id})
    created_note["_id"] = note_id
    return Note(**created_note)

@router.get("/teacher/{teacher_id}", response_model=List[Note])
async def get_teacher_notes(teacher_id: str):
    """Get all notes by a teacher."""
    
    db = await get_db()
    
    notes = []
    async for note in db.notes.find({"teacher_id": teacher_id}).sort("created_at", -1):
        note["_id"] = str(note["_id"])
        notes.append(Note(**note))
    
    return notes

@router.get("/class/{class_id}", response_model=List[Note])
async def get_class_notes(class_id: str):
    """Get all notes for a class."""
    
    db = await get_db()
    
    notes = []
    async for note in db.notes.find({"class_id": class_id, "is_public": True}).sort("created_at", -1):
        note["_id"] = str(note["_id"])
        notes.append(Note(**note))
    
    return notes

@router.put("/{note_id}", response_model=Note)
async def update_note(
    note_id: str,
    note_data: NoteUpdate,
    current_teacher: User = Depends(get_current_teacher)
):
    """Update a note (only by creator)."""
    
    db = await get_db()
    
    if not ObjectId.is_valid(note_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid note ID"
        )
    
    # Check ownership
    existing_note = await db.notes.find_one({"_id": ObjectId(note_id)})
    if not existing_note or existing_note["teacher_id"] != current_teacher.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this note"
        )
    
    update_dict = note_data.model_dump(exclude_unset=True)
    update_dict["updated_at"] = datetime.utcnow()
    
    await db.notes.update_one(
        {"_id": ObjectId(note_id)},
        {"$set": update_dict}
    )
    
    updated_note = await db.notes.find_one({"_id": ObjectId(note_id)})
    updated_note["_id"] = str(updated_note["_id"])
    return Note(**updated_note)

@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(
    note_id: str,
    current_teacher: User = Depends(get_current_teacher)
):
    """Delete a note (only by creator)."""
    
    db = await get_db()
    
    if not ObjectId.is_valid(note_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid note ID"
        )
    
    # Check ownership
    existing_note = await db.notes.find_one({"_id": ObjectId(note_id)})
    if not existing_note or existing_note["teacher_id"] != current_teacher.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this note"
        )
    
    await db.notes.delete_one({"_id": ObjectId(note_id)})
    return None