from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class UserBase(BaseModel):
    phone_number: str = Field(..., description="User phone number")
    telegram_id: Optional[int] = Field(None, description="Telegram user ID")
    telegram_username: Optional[str] = Field(None, description="Telegram username")


class UserCreate(UserBase):
    pass


class User(UserBase):
    id: str = Field(..., description="User UUID")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")

    class Config:
        from_attributes = True
