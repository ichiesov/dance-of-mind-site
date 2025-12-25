"""
FastAPI dependencies for authentication and authorization.
"""
from fastapi import Header, HTTPException, status
from typing import Annotated

from src.services import JWTService


def get_current_user_id(authorization: str = Header(...)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization.replace("Bearer ", "")
    jwt_service = JWTService()

    # verify_token проверяет:
    # 1. Декодирование токена серверным ключом
    # 2. Срок действия (exp claim)
    # 3. Тип токена (access)
    payload = jwt_service.verify_token(token, token_type="access")

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id


# Type alias для удобного использования в роутах
CurrentUserId = Annotated[str, Header()]
