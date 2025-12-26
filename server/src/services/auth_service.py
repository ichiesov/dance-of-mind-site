from datetime import datetime, timedelta, timezone
from typing import Optional
import uuid

from src.database import get_supabase_client
from src.models import AuthSession, AuthStatus, TokenPair
from src.config.settings import (
    settings,
    AUTH_SESSION_TIMEOUT,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS
)
from src.services.jwt_service import JWTService
from src.services.user_service import UserService
from src.services.event_service import EventService


class AuthService:
    def __init__(self):
        self.db = get_supabase_client()
        self.jwt_service = JWTService()
        self.user_service = UserService()
        self.event_service = EventService()

    def create_auth_session(self, phone_number: str) -> AuthSession:
        self.user_service.get_or_create_user(phone_number)

        self._expire_old_sessions(phone_number)

        now = datetime.now(timezone.utc)
        expires_at = now + timedelta(seconds=AUTH_SESSION_TIMEOUT)

        data = {
            "phone_number": phone_number,
            "status": AuthStatus.PENDING.value,
            "created_at": now.isoformat(),
            "expires_at": expires_at.isoformat(),
        }

        response = self.db.table("auth_sessions").insert(data).execute()

        return AuthSession(**response.data[0])

    def get_auth_session(self, session_id: str) -> Optional[AuthSession]:
        response = (
            self.db.table("auth_sessions")
            .select("*")
            .eq("id", session_id)
            .execute()
        )

        if response.data:
            session = AuthSession(**response.data[0])
            if session.status == AuthStatus.PENDING and session.expires_at < datetime.now(timezone.utc):
                session = self.expire_session(session_id)
            return session

        return None

    def get_pending_session_by_phone(self, phone_number: str) -> Optional[AuthSession]:
        response = (
            self.db.table("auth_sessions")
            .select("*")
            .eq("phone_number", phone_number)
            .eq("status", AuthStatus.PENDING.value)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        if response.data:
            session = AuthSession(**response.data[0])
            if session.expires_at < datetime.now(timezone.utc):
                self.expire_session(session.id)
                return None
            return session

        return None

    def get_pending_session_by_telegram(self, telegram_id: int) -> Optional[AuthSession]:
        user = self.user_service.get_user_by_telegram_id(telegram_id)
        if not user:
            return None

        return self.get_pending_session_by_phone(user.phone_number)

    async def approve_session(
        self,
        session_id: str,
        telegram_id: int,
        telegram_username: Optional[str] = None,
    ) -> Optional[AuthSession]:
        session = self.get_auth_session(session_id)

        if not session or session.status != AuthStatus.PENDING:
            return None

        if session.expires_at < datetime.now(timezone.utc):
            return self.expire_session(session_id)

        self.user_service.update_user_telegram_info(
            phone_number=session.phone_number,
            telegram_id=telegram_id,
            telegram_username=telegram_username,
        )

        now = datetime.now(timezone.utc)
        update_data = {
            "status": AuthStatus.APPROVED.value,
            "telegram_id": telegram_id,
            "approved_at": now.isoformat(),
        }

        response = (
            self.db.table("auth_sessions")
            .update(update_data)
            .eq("id", session_id)
            .execute()
        )

        if response.data:
            await self.event_service.send_auth_approved_event(session_id)
            return AuthSession(**response.data[0])
        return None

    async def reject_session(self, session_id: str) -> Optional[AuthSession]:
        update_data = {"status": AuthStatus.REJECTED.value}

        response = (
            self.db.table("auth_sessions")
            .update(update_data)
            .eq("id", session_id)
            .execute()
        )

        if response.data:
            await self.event_service.send_auth_rejected_event(session_id)
            return AuthSession(**response.data[0])
        return None

    def expire_session(self, session_id: str) -> Optional[AuthSession]:
        update_data = {"status": AuthStatus.EXPIRED.value}

        response = (
            self.db.table("auth_sessions")
            .update(update_data)
            .eq("id", session_id)
            .execute()
        )

        if response.data:
            return AuthSession(**response.data[0])
        return None

    def generate_tokens_for_session(self, session_id: str) -> Optional[TokenPair]:
        session = self.get_auth_session(session_id)

        if not session or session.status != AuthStatus.APPROVED:
            return None

        user = self.user_service.get_user_by_phone(session.phone_number)
        if not user:
            return None

        tokens = self.jwt_service.create_token_pair(user.id, user.phone_number)

        return TokenPair(
            access_token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
            access_expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            refresh_expires_in=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        )

    def _expire_old_sessions(self, phone_number: str) -> None:
        self.db.table("auth_sessions").update(
            {"status": AuthStatus.EXPIRED.value}
        ).eq("phone_number", phone_number).eq("status", AuthStatus.PENDING.value).execute()
