from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class EnrollmentStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"

class EnrollmentBase(BaseModel):
    student_id: str
    class_id: str
    teacher_id: str
    amount: float

class EnrollmentCreate(BaseModel):
    class_id: str

class Enrollment(EnrollmentBase):
    id: str = Field(alias="_id")
    enrolled_date: datetime = Field(default_factory=datetime.utcnow)
    status: EnrollmentStatus = EnrollmentStatus.ACTIVE
    payment_status: PaymentStatus = PaymentStatus.PENDING
    payment_intent_id: Optional[str] = None

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "student_id": "507f1f77bcf86cd799439012",
                "class_id": "507f1f77bcf86cd799439013",
                "teacher_id": "507f1f77bcf86cd799439014",
                "payment_status": "paid",
                "status": "active"
            }
        }