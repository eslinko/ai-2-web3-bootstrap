"""
Entry point веб2-ноды: запуск ASGI (эталон: bot/main.py запускает бота + API или только API).

Подсказка: для чистого API — uvicorn api.main:app.
"""
import os

# Hint: PYTHONPATH должен включать корень пакета ноды (как в эталоне: export PYTHONPATH=.)
if __name__ == "__main__":
    import uvicorn

    host = os.environ.get("AMANITA_API_HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", os.environ.get("AMANITA_API_PORT", "8000")))
    uvicorn.run(
        "api.main:app",
        host=host,
        port=port,
        reload=os.environ.get("AMANITA_API_ENVIRONMENT", "development") == "development",
    )
