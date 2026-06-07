import os
from dataclasses import dataclass

try:
    from dotenv import load_dotenv

    load_dotenv(override=True)
except ModuleNotFoundError:
    # The service can still run from real environment variables without python-dotenv.
    pass


def _boolean_env(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None:
        return default

    return value.strip().lower() in {"1", "true", "yes", "on"}


@dataclass(frozen=True)
class Settings:
    ai_database_url: str = os.getenv(
        "AI_DATABASE_URL",
        "postgresql://postgres:password@localhost:5435/askdocs_ai_development",
    )
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openrouter_api_key: str = os.getenv("OPENROUTER_API_KEY", "")
    openrouter_base_url: str = os.getenv(
        "OPENROUTER_BASE_URL",
        "https://openrouter.ai/api/v1",
    )
    use_fake_ai: bool = _boolean_env("USE_FAKE_AI", True)
    use_fake_embeddings: bool = _boolean_env(
        "USE_FAKE_EMBEDDINGS",
        _boolean_env("USE_FAKE_AI", True),
    )
    answer_provider: str = os.getenv(
        "ANSWER_PROVIDER",
        "fake" if _boolean_env("USE_FAKE_AI", True) else "openai",
    )
    embedding_model: str = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
    embedding_dimension: int = int(os.getenv("EMBEDDING_DIMENSION", "1536"))
    answer_model: str = os.getenv("ANSWER_MODEL", "openai/gpt-4o-mini")
    top_k: int = int(os.getenv("TOP_K", "5"))


settings = Settings()
