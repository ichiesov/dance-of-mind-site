from typing import Optional
from datetime import datetime, timezone

from src.database import get_supabase_client
from src.models import User, UserCreate


class UserService:
    def __init__(self):
        self.db = get_supabase_client()

    def get_user_by_phone(self, phone_number: str) -> Optional[User]:
        response = self.db.table("users").select("*").eq("phone_number", phone_number).execute()

        if response.data:
            return User(**response.data[0])
        return None

    def get_user_by_telegram_id(self, telegram_id: int) -> Optional[User]:
        response = self.db.table("users").select("*").eq("telegram_id", telegram_id).execute()

        if response.data:
            return User(**response.data[0])
        return None

    def create_user(self, user_data: UserCreate) -> User:
        now = datetime.now(timezone.utc)

        data = {
            "phone_number": user_data.phone_number,
            "telegram_id": user_data.telegram_id,
            "telegram_username": user_data.telegram_username,
            "created_at": now.isoformat(),
            "updated_at": now.isoformat(),
        }

        response = self.db.table("users").insert(data).execute()

        return User(**response.data[0])

    def update_user_telegram_info(
        self,
        phone_number: str,
        telegram_id: int,
        telegram_username: Optional[str] = None,
    ) -> Optional[User]:
        update_data = {
            "telegram_id": telegram_id,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }

        if telegram_username:
            update_data["telegram_username"] = telegram_username

        response = (
            self.db.table("users")
            .update(update_data)
            .eq("phone_number", phone_number)
            .execute()
        )

        if response.data:
            return User(**response.data[0])
        return None

    def get_or_create_user(self, phone_number: str) -> User:
        user = self.get_user_by_phone(phone_number)

        if not user:
            user_data = UserCreate(phone_number=phone_number)
            user = self.create_user(user_data)

        return user
