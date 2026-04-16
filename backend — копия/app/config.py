from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = "dev"
    cors_origins: str = "http://localhost:5173"

    # Default: SQLite file in the backend folder — zero setup for local dev.
    # For prod (Railway), set DATABASE_URL to a postgres:// / postgresql:// URL.
    database_url: str = "sqlite:///./nbu_rs.db"

    anthropic_api_key: str = ""
    anthropic_model: str = "claude-sonnet-4-6"
    anthropic_max_tokens: int = 2000

    session_secret: str = "change-me"
    max_upload_bytes: int = 5 * 1024 * 1024

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
