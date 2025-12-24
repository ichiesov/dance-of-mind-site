from pydantic import BaseModel, Field


class CompleteQuestRequest(BaseModel):
    quest_id: str = Field(..., description="Quest ID to mark as completed")


class ProgressResponse(BaseModel):
    completed_quests: list[str] = Field(..., description="List of completed quest IDs")
