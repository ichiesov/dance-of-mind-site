import logging

from fastapi import APIRouter, HTTPException, status, Depends

from src.models.progress import CompleteQuestRequest, ProgressResponse
from src.services import ProgressService
from src.database import get_supabase_client
from src.api.dependencies import get_current_user_id

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/progress", tags=["progress"])


@router.get("", response_model=ProgressResponse)
async def get_progress(user_id: str = Depends(get_current_user_id)):
    try:

        db = get_supabase_client()
        progress_service = ProgressService(db)

        completed_quests = progress_service.get_progress(user_id)

        return ProgressResponse(completed_quests=completed_quests)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting progress: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get progress",
        )


@router.post("/complete", status_code=status.HTTP_200_OK)
async def complete_quest(
    request: CompleteQuestRequest,
    user_id: str = Depends(get_current_user_id)
):
    try:

        db = get_supabase_client()
        progress_service = ProgressService(db)

        success = progress_service.complete_quest(user_id, request.quest_id)

        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to complete quest",
            )

        return {"success": True, "quest_id": request.quest_id}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error completing quest: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to complete quest",
        )
