import logging

from fastapi import APIRouter, HTTPException, status, Header, Depends
from pydantic import BaseModel, Field

from src.models import AuthSessionResponse, TokenPair, AuthStatus
from src.services import AuthService, UserService
from src.bot import get_bot
from src.api.dependencies import get_current_user_id

from src.utils import to_e164

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["authentication"])


class InitAuthRequest(BaseModel):
    phone_number: str = Field(..., description="User phone number")


@router.post("/init", response_model=AuthSessionResponse, status_code=status.HTTP_201_CREATED)
async def init_auth(request: InitAuthRequest) -> AuthSessionResponse:
    try:
        auth_service = AuthService()
        user_service = UserService()

        phone_number = to_e164(request.phone_number)

        session = auth_service.create_auth_session(phone_number)

        user = user_service.get_user_by_phone(phone_number)

        # Есть связка с ботом -> отправляем запрос на авторизацию
        if user and user.telegram_id:
            bot = get_bot()
            await bot.notify_new_auth_request(user.telegram_id, session.id)

        logger.info(f"Auth session created: {session.id} for {phone_number}")

        return AuthSessionResponse(
            session_id=session.id,
            expires_in=(session.expires_at - session.created_at).seconds,
        )

    except Exception as e:
        logger.error(f"Error initiating auth: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to initiate authentication",
        )


@router.get("/tokens/{session_id}", response_model=TokenPair)
async def get_auth_tokens(session_id: str) -> TokenPair:
    try:
        auth_service = AuthService()

        session = auth_service.get_auth_session(session_id)

        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Auth session not found",
            )

        if session.status != AuthStatus.APPROVED:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Auth session not approved",
            )

        tokens = auth_service.generate_tokens_for_session(session_id)

        if not tokens:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate tokens",
            )

        return tokens

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting auth tokens: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get tokens",
        )


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., description="Refresh token")


@router.post("/refresh", response_model=TokenPair)
async def refresh_token(request: RefreshTokenRequest) -> TokenPair:
    try:
        from src.services import JWTService
        from src.config import settings

        jwt_service = JWTService()

        payload = jwt_service.verify_token(request.refresh_token, token_type="refresh")

        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

        user_id = payload.get("sub")
        phone_number = payload.get("phone")

        if not user_id or not phone_number:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )

        tokens = jwt_service.create_token_pair(user_id, phone_number)

        return TokenPair(
            access_token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
            access_expires_in=settings.access_token_expire_minutes * 60,
            refresh_expires_in=settings.refresh_token_expire_days * 24 * 60 * 60,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error refreshing token: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to refresh token",
        )


@router.get("/me")
async def get_current_user(user_id: str = Depends(get_current_user_id)):
    """
    Получить информацию о текущем пользователе.

    Requires:
        - Valid access token (проверяется декодирование + срок действия)
    """
    try:
        from src.database import get_supabase_client
        db = get_supabase_client()
        response = db.table("users").select("*").eq("id", user_id).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        return response.data[0]

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting current user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user info",
        )
