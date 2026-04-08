"""
Создание FastAPI-приложения (эталон: bot/api/main.py — middleware, lifespan, роутеры).

Стартер: только health; добавляйте CORS, HMAC, Bearer по контракту интервью.
"""
from __future__ import annotations

from fastapi import FastAPI

from api.config import APIConfig
from api.routes.health import router as health_router


def create_app() -> FastAPI:
    cfg = APIConfig.get_fastapi_config()
    app = FastAPI(**cfg)
    app.include_router(health_router)
    # Hook: app.add_middleware(...); app.include_router(activities_router, prefix="/activities")
    return app


app = create_app()
