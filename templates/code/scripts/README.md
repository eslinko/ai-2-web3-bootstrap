# Scripts starter layer (mixed scaffold)

Не копия эталонного `scripts/` целиком. Структура:

| Папка | Назначение |
|-------|------------|
| `router/` | минимальный `deploy_router.stub.js` + registry |
| `config/` | env-path, constants, index с опциональным dotenv |
| `lib/` | logger и место для мелких helpers |
| `shell/` | шаблоны sync-artifacts и smoke-health |
| `validators/` | один phase-validator stub |
| `deployment/` | README формата + минимальный JSON пример |
| `deploy/` | `floou_health_smoke.sh` — короткий smoke pattern |

Убери суффиксы `.stub` / `.template` при переносе в целевой репозиторий и подключи тесты/линтер целевого проекта.
