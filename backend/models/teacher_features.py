from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
from enum import Enum

# Attendance Models
class AttendanceStatus(str, Enum):
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"

class AttendanceRecord(BaseModel):
    id: str = Field(alias="_id")
    class_id: str
    student_id: str
    date: date
    status: AttendanceStatus
    notes: Optional[str] = None
    created_by: str  # teacher_id
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class AttendanceCreate(BaseModel):
    class_id: str
    student_id: str
    date: date
    status: AttendanceStatus
    notes: Optional[str] = None

# Notes Models
class Note(BaseModel):
    id: str = Field(alias="_id")
    title: str
    content: str
    class_id: Optional[str] = None
    teacher_id: str
    is_public: bool = True
    tags: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class NoteCreate(BaseModel):
    title: str
    content: str
    class_id: Optional[str] = None
    is_public: bool = True
    tags: List[str] = []

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_public: Optional[bool] = None
    tags: Optional[List[str]] = None

# Assignment Models
class AssignmentStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    CLOSED = "closed"

class Assignment(BaseModel):
    id: str = Field(alias="_id")
    title: str
    description: str
    class_id: str
    teacher_id: str
    due_date: datetime
    total_marks: int
    status: AssignmentStatus = AssignmentStatus.PUBLISHED
    attachments: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class AssignmentCreate(BaseModel):
    title: str
    description: str
    class_id: str
    due_date: datetime
    total_marks: int
    status: AssignmentStatus = AssignmentStatus.PUBLISHED
    attachments: List[str] = []

class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    total_marks: Optional[int] = None
    status: Optional[AssignmentStatus] = None

# Submission Models
class SubmissionStatus(str, Enum):
    PENDING = "pending"
    SUBMITTED = "submitted"
    GRADED = "graded"

class Submission(BaseModel):
    id: str = Field(alias="_id")
    assignment_id: str
    student_id: str
    content: str
    attachments: List[str] = []
    submitted_at: Optional[datetime] = None
    marks_obtained: Optional[int] = None
    feedback: Optional[str] = None
    status: SubmissionStatus = SubmissionStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

# Community Post Models
class PostType(str, Enum):
    ANNOUNCEMENT = "announcement"
    DISCUSSION = "discussion"
    RESOURCE = "resource"

class CommunityPost(BaseModel):
    id: str = Field(alias="_id")
    title: str
    content: str
    post_type: PostType
    teacher_id: str
    class_id: Optional[str] = None  # None means visible to all students
    attachments: List[str] = []
    likes_count: int = 0
    comments_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class PostCreate(BaseModel):
    title: str
    content: str
    post_type: PostType
    class_id: Optional[str] = None
    attachments: List[str] = []

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    post_type: Optional[PostType] = None
