"""
Конфигурация API через os.environ с префиксом (паттерн эталона: bot/api/config.py — APIConfig).

Заполните префикс под проект; не храните секреты в коде.
"""
import os
from typing import Any


class APIConfig:
    """Централизованные переменные окружения для FastAPI."""

    API_TITLE = os.environ.get("API_TITLE", "{{PROJECT_NAME}} API")
    API_VERSION = os.environ.get("API_VERSION", "0.1.0")

    ENVIRONMENT = os.environ.get("AMANITA_API_ENVIRONMENT", "development")
    HOST = os.environ.get("AMANITA_API_HOST", "0.0.0.0")
    PORT = int(os.environ.get("AMANITA_API_PORT", os.environ.get("PORT", "8000")))

    LOG_LEVEL = os.environ.get("AMANITA_API_LOG_LEVEL", "INFO")

    # Два контура доверия (эталон): Bearer для AI Actions; HMAC для интеграций — включить по мере надобности
    GPT_ACTIONS_BEARER_SECRET = os.environ.get("GPT_ACTIONS_BEARER_SECRET", "").strip()
    HMAC_SECRET_KEY = os.environ.get("AMANITA_API_HMAC_SECRET_KEY", "")

    OPENAPI_URL = os.environ.get("AMANITA_API_OPENAPI_URL", "/openapi.json")

    @classmethod
    def get_fastapi_config(cls) -> dict[str, Any]:
        return {
            "title": cls.API_TITLE,
            "version": cls.API_VERSION,
            "openapi_url": cls.OPENAPI_URL if cls.ENVIRONMENT != "production" else None,
        }
