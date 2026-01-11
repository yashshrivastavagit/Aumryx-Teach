from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserType(str, Enum):
    TEACHER = "teacher"
    STUDENT = "student"

class UserBase(BaseModel):
    name: str
    email: EmailStr
    user_type: UserType

class UserCreate(UserBase):
    password: str
    # Teacher-specific fields
    subjects: Optional[List[str]] = None
    experience: Optional[str] = None
    qualification: Optional[str] = None
    bio: Optional[str] = None
    hourly_rate: Optional[float] = None
    availability: Optional[List[str]] = None
    # Student-specific fields
    phone: Optional[str] = None
    grade: Optional[str] = None
    interests: Optional[List[str]] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    user_type: UserType

class User(UserBase):
    id: str = Field(alias="_id")
    verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Teacher-specific fields
    subjects: Optional[List[str]] = None
    experience: Optional[str] = None
    qualification: Optional[str] = None
    bio: Optional[str] = None
    hourly_rate: Optional[float] = None
    rating: Optional[float] = 0.0
    students_count: Optional[int] = 0
    image_url: Optional[str] = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
    availability: Optional[List[str]] = None
    
    # Student-specific fields
    phone: Optional[str] = None
    grade: Optional[str] = None
    interests: Optional[List[str]] = None

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "name": "Dr. Priya Sharma",
                "email": "priya@example.com",
                "user_type": "teacher",
                "verified": True,
                "subjects": ["Mathematics", "Physics"],
                "experience": "12 years",
                "hourly_rate": 800
            }
        }

class UserUpdate(BaseModel):
    name: Optional[str] = None
    subjects: Optional[List[str]] = None
    experience: Optional[str] = None
    qualification: Optional[str] = None
    bio: Optional[str] = None
    hourly_rate: Optional[float] = None
    availability: Optional[List[str]] = None
    phone: Optional[str] = None
    grade: Optional[str] = None
    interests: Optional[List[str]] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    user_id: Optional[str] = None
    user_type: Optional[str] = None