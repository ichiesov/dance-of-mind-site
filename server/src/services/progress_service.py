import logging
from typing import Optional
from supabase import Client

logger = logging.getLogger(__name__)


class ProgressService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    def get_progress(self, user_id: str) -> Optional[list[str]]:
        try:
            result = self.supabase.table("users").select("completed_quests").eq("id", user_id).single().execute()

            if result.data:
                return result.data.get("completed_quests", [])
            return []
        except Exception as e:
            logger.error(f"Error getting progress for user {user_id}: {e}")
            return []

    def complete_quest(self, user_id: str, quest_id: str) -> bool:
        try:
            current_progress = self.get_progress(user_id)

            if quest_id in current_progress:
                logger.info(f"Quest {quest_id} already completed for user {user_id}")
                return True

            updated_quests = current_progress + [quest_id]

            self.supabase.table("users").update({
                "completed_quests": updated_quests
            }).eq("id", user_id).execute()

            logger.info(f"Quest {quest_id} completed for user {user_id}")
            return True
        except Exception as e:
            logger.error(f"Error completing quest {quest_id} for user {user_id}: {e}")
            return False
