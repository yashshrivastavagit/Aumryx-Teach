from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from typing import List, Optional
from datetime import datetime

from models.teacher_features import CommunityPost, PostCreate, PostUpdate
from models.user import User
from dependencies import get_current_teacher, get_current_user

router = APIRouter(prefix="/community", tags=["Community"])

async def get_db():
    from server import db
    return db

@router.post("/posts", response_model=CommunityPost, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: PostCreate,
    current_teacher: User = Depends(get_current_teacher)
):
    """Create a community post (teachers only)."""
    
    db = await get_db()
    
    post_dict = post_data.model_dump()
    post_dict["teacher_id"] = current_teacher.id
    post_dict["likes_count"] = 0
    post_dict["comments_count"] = 0
    post_dict["created_at"] = datetime.utcnow()
    post_dict["updated_at"] = datetime.utcnow()
    
    result = await db.community_posts.insert_one(post_dict)
    post_id = str(result.inserted_id)
    
    created_post = await db.community_posts.find_one({"_id": result.inserted_id})
    created_post["_id"] = post_id
    return CommunityPost(**created_post)

@router.get("/posts/teacher/{teacher_id}", response_model=List[CommunityPost])
async def get_teacher_posts(teacher_id: str):
    """Get all posts by a teacher."""
    
    db = await get_db()
    
    posts = []
    async for post in db.community_posts.find({"teacher_id": teacher_id}).sort("created_at", -1):
        post["_id"] = str(post["_id"])
        posts.append(CommunityPost(**post))
    
    return posts

@router.get("/posts/class/{class_id}", response_model=List[CommunityPost])
async def get_class_posts(class_id: str):
    """Get all posts for a specific class."""
    
    db = await get_db()
    
    posts = []
    async for post in db.community_posts.find({"class_id": class_id}).sort("created_at", -1):
        post["_id"] = str(post["_id"])
        posts.append(CommunityPost(**post))
    
    return posts

@router.get("/posts", response_model=List[CommunityPost])
async def get_all_posts(
    limit: int = 50,
    current_user: User = Depends(get_current_user)
):
    """Get all community posts (for feed)."""
    
    db = await get_db()
    
    posts = []
    async for post in db.community_posts.find().sort("created_at", -1).limit(limit):
        post["_id"] = str(post["_id"])
        posts.append(CommunityPost(**post))
    
    return posts

@router.put("/posts/{post_id}", response_model=CommunityPost)
async def update_post(
    post_id: str,
    post_data: PostUpdate,
    current_teacher: User = Depends(get_current_teacher)
):
    """Update a community post (only by creator)."""
    
    db = await get_db()
    
    if not ObjectId.is_valid(post_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid post ID"
        )
    
    # Check ownership
    existing = await db.community_posts.find_one({"_id": ObjectId(post_id)})
    if not existing or existing["teacher_id"] != current_teacher.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this post"
        )
    
    update_dict = post_data.model_dump(exclude_unset=True)
    update_dict["updated_at"] = datetime.utcnow()
    
    await db.community_posts.update_one(
        {"_id": ObjectId(post_id)},
        {"$set": update_dict}
    )
    
    updated = await db.community_posts.find_one({"_id": ObjectId(post_id)})
    updated["_id"] = str(updated["_id"])
    return CommunityPost(**updated)

@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: str,
    current_teacher: User = Depends(get_current_teacher)
):
    """Delete a community post (only by creator)."""
    
    db = await get_db()
    
    if not ObjectId.is_valid(post_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid post ID"
        )
    
    # Check ownership
    existing = await db.community_posts.find_one({"_id": ObjectId(post_id)})
    if not existing or existing["teacher_id"] != current_teacher.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this post"
        )
    
    await db.community_posts.delete_one({"_id": ObjectId(post_id)})
    return None