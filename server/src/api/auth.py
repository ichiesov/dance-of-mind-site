import logging

from fastapi import APIRouter, HTTPException, status, Header
from pydantic import BaseModel, Field

from src.models import AuthSessionResponse, TokenPair, AuthStatus
from src.services import AuthService, UserService
from src.bot import get_bot

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["authentication"])


class InitAuthRequest(BaseModel):
    phone_number: str = Field(..., description="User phone number")


@router.post("/init", response_model=AuthSessionResponse, status_code=status.HTTP_201_CREATED)
async def init_auth(request: InitAuthRequest) -> AuthSessionResponse:
    try:
        auth_service = AuthService()
        user_service = UserService()

        session = auth_service.create_auth_session(request.phone_number)

        user = user_service.get_user_by_phone(request.phone_number)

        if user and user.telegram_id:
            bot = get_bot()
            await bot.notify_new_auth_request(user.telegram_id, session.id)

        logger.info(f"Auth session created: {session.id} for {request.phone_number}")

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


@router.post("/refresh", response_model=TokenPair)
async def refresh_token(refresh_token: str) -> TokenPair:
    try:
        from src.services import JWTService

        jwt_service = JWTService()

        payload = jwt_service.verify_token(refresh_token, token_type="refresh")

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
            expires_in=jwt_service.settings.access_token_expire_minutes * 60,
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
async def get_current_user(authorization: str = Header(...)):
    try:
        from src.services import JWTService

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

        user_service = UserService()
        user_id = payload.get("sub")

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
