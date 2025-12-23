from pydantic_settings import BaseSettings, SettingsConfigDict


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
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    auth_session_timeout: int = 300


settings = Settings()
