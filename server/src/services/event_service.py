import logging
import httpx
from typing import Optional, Dict, Any

from src.config import settings

logger = logging.getLogger(__name__)


class EventService:
    def __init__(self):
        self.supabase_url = settings.supabase_url
        self.supabase_key = settings.supabase_service_key

    async def send_auth_event(
        self,
        session_id: str,
        event_type: str,
        data: Optional[Dict[str, Any]] = None
    ) -> bool:
        try:
            channel_name = f"auth:{session_id}"

            payload = {
                "type": "broadcast",
                "event": event_type,
                "payload": data or {}
            }

            url = f"{self.supabase_url}/realtime/v1/api/broadcast"

            headers = {
                "apikey": self.supabase_key,
                "Authorization": f"Bearer {self.supabase_key}",
                "Content-Type": "application/json"
            }

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url,
                    json={
                        "channel": channel_name,
                        "payload": payload
                    },
                    headers=headers
                )

                if response.status_code in [200, 201, 204]:
                    logger.info(f"Auth event sent: {event_type} for session {session_id}")
                    return True
                else:
                    logger.error(f"Failed to send auth event: {event_type}, status: {response.status_code}")
                    return False

        except Exception as e:
            logger.error(f"Error sending auth event: {e}")
            return False

    async def send_bot_started_event(self, session_id: str, telegram_id: int) -> bool:
        return await self.send_auth_event(
            session_id=session_id,
            event_type="bot_started",
            data={"telegram_id": telegram_id}
        )

    async def send_phone_shared_event(self, session_id: str, phone_number: str) -> bool:
        return await self.send_auth_event(
            session_id=session_id,
            event_type="phone_shared",
            data={"phone_number": phone_number}
        )

    async def send_auth_approved_event(self, session_id: str) -> bool:
        return await self.send_auth_event(
            session_id=session_id,
            event_type="auth_approved",
            data={}
        )

    async def send_auth_rejected_event(self, session_id: str) -> bool:
        return await self.send_auth_event(
            session_id=session_id,
            event_type="auth_rejected",
            data={}
        )
