"""Health / smoke (эталон: detailed health в bot/api — здесь минимум)."""

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
async def health():
    return {"status": "ok", "service": "{{PROJECT_NAME}}-node"}
