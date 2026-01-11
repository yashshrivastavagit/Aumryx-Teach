from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class ClassStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

class ClassBase(BaseModel):
    title: str
    subject: str
    description: str
    price: float
    duration: str
    max_students: int
    schedule: str
    meeting_link: str

class ClassCreate(ClassBase):
    pass

class Class(ClassBase):
    id: str = Field(alias="_id")
    teacher_id: str
    enrolled_students: int = 0
    status: ClassStatus = ClassStatus.ACTIVE
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "teacher_id": "507f1f77bcf86cd799439012",
                "title": "Advanced Mathematics for Class 12",
                "subject": "Mathematics",
                "price": 800,
                "enrolled_students": 5
            }
        }

class ClassUpdate(BaseModel):
    title: Optional[str] = None
    subject: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[str] = None
    max_students: Optional[int] = None
    schedule: Optional[str] = None
    meeting_link: Optional[str] = None
    status: Optional[ClassStatus] = None