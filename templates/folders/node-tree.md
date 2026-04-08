# Шаблон: node/ (web2-нода)

```
node/
├── main.py                 # uvicorn entry (starter: templates/code/node/main.py)
├── requirements-starter.txt
├── api/
│   ├── main.py             # create_app(), include_router
│   ├── config.py           # APIConfig из env
│   ├── dependencies.py
│   ├── routes/
│   │   └── health.py
│   ├── middleware/         # добавить по интервью
│   └── models/             # Pydantic — по интервью
├── handlers/               # опционально: Telegram
├── services/
│   ├── application/
│   ├── core/
│   └── upload/
├── tests/
└── docs/
```

В репозитории **Amanita** эта роль сейчас в папке `bot/` (историческое имя); в новых проектах из bootstrap — **`node/`**. Стартер v1.1: см. `templates/code/node/`.
