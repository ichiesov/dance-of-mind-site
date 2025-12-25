from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class AuthStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXPIRED = "expired"


class AuthSession(BaseModel):
    id: str = Field(..., description="Session UUID")
    phone_number: str = Field(..., description="Phone number requesting auth")
    telegram_id: Optional[int] = Field(None, description="Telegram user ID")
    status: AuthStatus = Field(default=AuthStatus.PENDING, description="Session status")
    created_at: datetime = Field(..., description="Creation timestamp")
    expires_at: datetime = Field(..., description="Expiration timestamp")
    approved_at: Optional[datetime] = Field(None, description="Approval timestamp")

    class Config:
        from_attributes = True


class AuthSessionCreate(BaseModel):
    phone_number: str = Field(..., description="Phone number requesting auth")


class AuthSessionResponse(BaseModel):
    session_id: str = Field(..., description="Session ID for polling")
    expires_in: int = Field(..., description="Expiration time in seconds")


class TokenPair(BaseModel):
    access_token: str = Field(..., description="Access JWT token")
    refresh_token: str = Field(..., description="Refresh JWT token")
    access_expires_in: int = Field(..., description="Access token expiration in seconds")
    refresh_expires_in: int = Field(..., description="Refresh token expiration in seconds")
