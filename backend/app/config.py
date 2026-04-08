from pydantic_settings import BaseSettings
import secrets


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:postgres@db:5432/xanggiau24h"
    cors_origins: str = "http://localhost:3000"
    gold_api_key: str = ""

    # Admin auth
    secret_key: str = secrets.token_urlsafe(32)
    admin_username: str = "admin"
    admin_password: str = "admin123"
    access_token_expire_minutes: int = 60 * 24

    class Config:
        env_file = ".env"


settings = Settings()
