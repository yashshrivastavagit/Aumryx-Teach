from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

# Profile Picture Model
class ProfilePictureUpdate(BaseModel):
    image_url: str

# Enhanced Class Model with individual pricing
class EnhancedClassCreate(BaseModel):
    title: str
    subject: str
    description: str
    price: float  # Teacher sets their own price
    duration: str
    max_students: int
    schedule: str
    meeting_link: str
    thumbnail_url: Optional[str] = None
    syllabus: Optional[str] = None
    prerequisites: Optional[str] = None

# Rating and Review Models
class RatingCreate(BaseModel):
    teacher_id: str
    student_id: str
    class_id: str
    rating: int = Field(ge=1, le=5)
    review: Optional[str] = None

class Rating(BaseModel):
    id: str = Field(alias="_id")
    teacher_id: str
    student_id: str
    class_id: str
    rating: int
    review: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

# Progress Tracking Model
class ProgressStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class StudentProgress(BaseModel):
    id: str = Field(alias="_id")
    student_id: str
    class_id: str
    enrollment_id: str
    attendance_percentage: float = 0.0
    assignments_completed: int = 0
    total_assignments: int = 0
    progress_status: ProgressStatus = ProgressStatus.NOT_STARTED
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None

    class Config:
        populate_by_name = True

# Teacher Analytics Model
class TeacherAnalytics(BaseModel):
    teacher_id: str
    total_students: int
    total_classes: int
    total_revenue: float
    average_rating: float
    total_reviews: int
    classes_completed: int
    active_enrollments: int
    course_views: int

# Student Analytics Model  
class StudentAnalytics(BaseModel):
    student_id: str
    total_courses_enrolled: int
    courses_completed: int
    total_assignments_submitted: int
    average_score: float
    total_hours_learned: float
    certificates_earned: int
    current_streak: int

# Notification Model
class NotificationType(str, Enum):
    CLASS_REMINDER = "class_reminder"
    ASSIGNMENT_DUE = "assignment_due"
    NEW_CONTENT = "new_content"
    ENROLLMENT = "enrollment"
    PAYMENT = "payment"
    MESSAGE = "message"

class Notification(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    user_type: str  # teacher or student
    notification_type: NotificationType
    title: str
    message: str
    link: Optional[str] = None
    read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class NotificationCreate(BaseModel):
    user_id: str
    user_type: str
    notification_type: NotificationType
    title: str
    message: str
    link: Optional[str] = None

# Certificate Model
class Certificate(BaseModel):
    id: str = Field(alias="_id")
    student_id: str
    teacher_id: str
    class_id: str
    certificate_number: str
    issue_date: datetime = Field(default_factory=datetime.utcnow)
    completion_percentage: float
    grade: Optional[str] = None

    class Config:
        populate_by_name = True
