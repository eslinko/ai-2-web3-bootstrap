# Node (web2) starter

Структура отражает эталон **bot/**: `api/main.py`, `api/config.py`, `api/dependencies.py`, `api/routes/`.

## Запуск (dev)

```bash
cd node
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-starter.txt
export PYTHONPATH=.
python main.py
```

Откройте `/docs` если `openapi_url` не отключён.

## Следующие хуки

- Роутеры домена (`/activities`, `/v1/uploads`, …).
- Middleware: Bearer (GPT Actions), HMAC (интеграции) — порядок слоёв как в эталоне `bot/api/main.py`.
- Security boundaries: `api/middleware/security/`, `api/security/`, `services/signing/`, `services/auth/`.
- GPT boundaries: `services/gpt_ingest/`, `services/gpt_validation/`, `services/gpt_mapping/`, `src/domain/contracts/gpt_payload/`.
