from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, Any
from datetime import datetime

# Helper to allow ObjectId as string
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserPreferences(BaseModel):
    language: str = "en-US"
    theme: str = "dark"
    sign_language: str = "asl"
    avatar_enabled: bool = False
    
    model_config = ConfigDict(populate_by_name=True)

class UserCorrection(BaseModel):
    id: Optional[str] = None
    user_id: str
    original_text: str
    corrected_text: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class UserStats(BaseModel):
    total_translations: int
    active_time_minutes: int
    accuracy_rate: float
