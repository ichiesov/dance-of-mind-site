from pydantic_settings import BaseSettings, SettingsConfigDict


# Application constants
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7
AUTH_SESSION_TIMEOUT = 300


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True

    telegram_bot_token: str
    telegram_bot_username: str = ""

    supabase_url: str
    supabase_key: str
    supabase_service_key: str

    jwt_secret_key: str


settings = Settings()
