from pydantic_settings import BaseSettings
import secrets
import warnings


# Generate a stable default key per process (won't rotate on import)
_DEFAULT_SECRET = secrets.token_urlsafe(32)


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:postgres@db:5432/xanggiau24h"
    cors_origins: str = "http://localhost:3000"
    gold_api_key: str = ""

    # Admin auth
    secret_key: str = _DEFAULT_SECRET
    admin_username: str = "admin"
    admin_password: str = "admin123"
    access_token_expire_minutes: int = 60 * 24

    # Email settings
    smtp_server: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    email_from: str = "contact@xangvang24h.vn"
    email_to_admin: str = "lapgun06@gmail.com"

    class Config:
        env_file = ".env"


settings = Settings()

# Warn about insecure defaults
if settings.secret_key == _DEFAULT_SECRET:
    warnings.warn(
        "SECRET_KEY not set in environment! Using random key — tokens will be invalidated on restart.",
        stacklevel=1,
    )
if settings.admin_password == "admin123":
    warnings.warn(
        "ADMIN_PASSWORD is using the default 'admin123'. Set a strong password in .env!",
        stacklevel=1,
    )
