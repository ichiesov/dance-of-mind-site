import logging

from fastapi import APIRouter, HTTPException, status, Header

from src.models.progress import CompleteQuestRequest, ProgressResponse
from src.services import ProgressService, JWTService
from src.database import get_supabase_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/progress", tags=["progress"])


def get_user_id_from_token(authorization: str) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
        )

    token = authorization.replace("Bearer ", "")
    jwt_service = JWTService()

    payload = jwt_service.verify_token(token, token_type="access")

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token",
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    return user_id


@router.get("", response_model=ProgressResponse)
async def get_progress(authorization: str = Header(...)):
    try:
        user_id = get_user_id_from_token(authorization)

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
    authorization: str = Header(...)
):
    try:
        user_id = get_user_id_from_token(authorization)

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
