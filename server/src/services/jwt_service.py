from datetime import datetime, timedelta, timezone
from typing import Dict, Optional
import jwt
from jwt.exceptions import InvalidTokenError

from src.config.settings import (
    settings,
    JWT_ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS
)


class JWTService:
    @staticmethod
    def create_access_token(user_id: str, phone_number: str) -> str:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )

        payload = {
            "sub": user_id,
            "phone": phone_number,
            "type": "access",
            "exp": expire,
            "iat": datetime.now(timezone.utc),
        }

        return jwt.encode(
            payload,
            settings.jwt_secret_key,
            algorithm=JWT_ALGORITHM
        )

    @staticmethod
    def create_refresh_token(user_id: str, phone_number: str) -> str:
        expire = datetime.now(timezone.utc) + timedelta(
            days=REFRESH_TOKEN_EXPIRE_DAYS
        )

        payload = {
            "sub": user_id,
            "phone": phone_number,
            "type": "refresh",
            "exp": expire,
            "iat": datetime.now(timezone.utc),
        }

        return jwt.encode(
            payload,
            settings.jwt_secret_key,
            algorithm=JWT_ALGORITHM
        )

    @staticmethod
    def create_token_pair(user_id: str, phone_number: str) -> Dict[str, str]:
        return {
            "access_token": JWTService.create_access_token(user_id, phone_number),
            "refresh_token": JWTService.create_refresh_token(user_id, phone_number),
        }

    @staticmethod
    def verify_token(token: str, token_type: str = "access") -> Optional[Dict]:
        """
        Проверяет валидность JWT токена.

        Выполняет следующие проверки:
        1. Декодирование токена с помощью серверного ключа (JWT_SECRET_KEY)
        2. Проверка срока действия токена (exp claim) - автоматически через jwt.decode
        3. Проверка типа токена (access/refresh)

        Args:
            token: JWT токен для проверки
            token_type: Ожидаемый тип токена ("access" или "refresh")

        Returns:
            Optional[Dict]: Payload токена если валиден, None если невалиден или истек

        Note:
            jwt.decode() автоматически проверяет:
            - Подпись токена (декодирование серверным ключом)
            - Срок действия (exp claim) - выбрасывает ExpiredSignatureError
            - Целостность токена (алгоритм подписи)
        """
        try:
            # jwt.decode проверяет подпись и срок действия
            payload = jwt.decode(
                token,
                settings.jwt_secret_key,
                algorithms=[JWT_ALGORITHM]
            )

            # Дополнительная проверка типа токена
            if payload.get("type") != token_type:
                return None

            return payload

        except InvalidTokenError:
            # Ловим все ошибки JWT: невалидная подпись, истекший токен, и т.д.
            return None

    @staticmethod
    def get_user_id_from_token(token: str) -> Optional[str]:
        payload = JWTService.verify_token(token)
        return payload.get("sub") if payload else None
