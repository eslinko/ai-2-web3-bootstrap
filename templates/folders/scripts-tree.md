# Шаблон: scripts/ (v1.9 mixed scaffold)

Целевое дерево после bootstrap — **не** полная копия эталона. Типичный старт из `templates/code/scripts` + сгенерированные `docs/scripts`:

```
scripts/
├── router/                 # deploy_router.stub.js → переименовать
├── config/
├── lib/
├── shell/                  # *.template.sh → убрать суффикс при переносе
├── validators/             # один phase stub
├── deployment/             # README + pipeline.*.example.json при spec
├── deploy/                 # опционально floou_health_smoke.sh
└── .env                    # из scripts.env.example (не в git с секретами)
```

Документация слоя — в `docs/scripts/` (из `templates/docs/scripts/`). Полный эталонный `lib/actions`, массовые `validators`, `tests/` — **не** в обязательном bundle.
