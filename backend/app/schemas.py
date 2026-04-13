from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Any
from datetime import datetime
from typing import List

# Helper to allow ObjectId as string
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = "Signer"

class UserCreate(UserBase):
    full_name: str
    password: str

class User(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    
    class Config:
        orm_mode = True
        allow_population_by_field_name = True

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
    
    class Config:
        allow_population_by_field_name = True

class UserCorrection(BaseModel):
    id: Optional[str] = None
    user_id: str
    original_text: str
    corrected_text: str
    created_at: datetime
    
    class Config:
        orm_mode = True
        allow_population_by_field_name = True

class UserStats(BaseModel):
    total_translations: int
    active_time_minutes: int
    accuracy_rate: float


class HistoryItemCreate(BaseModel):
    type: str
    content: str
    confidence: float = 1.0
    source: Optional[str] = None


class HistoryItem(BaseModel):
    id: str
    user_id: str
    type: str
    content: str
    confidence: float = 1.0
    source: Optional[str] = None
    created_at: datetime


class HistoryListResponse(BaseModel):
    items: List[HistoryItem]
    total: int


class UserProfileUpdate(BaseModel):
    full_name: str


class SupportRequestCreate(BaseModel):
    name: str
    email: EmailStr
    message: str


class SupportRequest(BaseModel):
    id: str
    name: str
    email: EmailStr
    message: str
    created_at: datetime
