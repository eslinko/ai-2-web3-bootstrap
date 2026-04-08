"""
FastAPI Depends — граница DI (эталон: bot/api/dependencies.py).

Стартер: заглушки провайдеров; замените на фабрики сервисов после интервью.
"""
from __future__ import annotations

from typing import Any

from fastapi import Depends


def get_settings() -> dict[str, Any]:
    """Пример простого провайдера конфигурации."""
    return {"environment": "starter"}


def get_example_service(settings: dict = Depends(get_settings)) -> dict[str, Any]:
    """Цепочка Depends для будущих сервисов (blockchain, storage, …)."""
    return {"settings": settings, "ready": True}
