from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime
import os

from models.user import UserCreate, UserLogin, User, Token, UserType
from utils.auth import verify_password, get_password_hash, create_access_token
from dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Database connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate):
    """Register a new user (teacher or student)."""
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user document
    user_dict = user_data.model_dump(exclude={"password"})
    user_dict["password_hash"] = get_password_hash(user_data.password)
    user_dict["created_at"] = datetime.utcnow()
    user_dict["updated_at"] = datetime.utcnow()
    
    # Set verification status
    if user_data.user_type == UserType.STUDENT:
        user_dict["verified"] = True  # Students auto-verified
    else:
        user_dict["verified"] = False  # Teachers need approval
        # Initialize teacher-specific fields
        user_dict["rating"] = 0.0
        user_dict["students_count"] = 0
        user_dict["image_url"] = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
    
    # Insert user
    result = await db.users.insert_one(user_dict)
    user_id = str(result.inserted_id)
    
    # Get created user
    created_user = await db.users.find_one({"_id": result.inserted_id})
    created_user["_id"] = user_id
    user_obj = User(**created_user)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user_id, "user_type": user_data.user_type.value}
    )
    
    return Token(access_token=access_token, token_type="bearer", user=user_obj)

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """Login user and return JWT token."""
    
    # Find user
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify user type matches
    if user["user_type"] != credentials.user_type.value:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"This email is registered as {user['user_type']}, not {credentials.user_type.value}"
        )
    
    # Verify password
    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Convert ObjectId to string
    user_id = str(user["_id"])
    user["_id"] = user_id
    user_obj = User(**user)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user_id, "user_type": user["user_type"]}
    )
    
    return Token(access_token=access_token, token_type="bearer", user=user_obj)

@router.get("/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile."""
    return current_user