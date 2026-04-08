# Deployment — {{PROJECT_NAME}}

## 1. Порядок выката (high-level)

1. Contracts compile + deploy router (`DEPLOY_ACTION`).
2. Sync ABI → нода (`sync_artifacts_to_*`).
3. Нода + uploader с согласованными env.
4. Smoke: health ноды и uploader (эталон: shell smoke).

## 2. Entry commands (заполнить)

- Hardhat: `npx hardhat compile`
- Нода: `uvicorn …` или `python main.py`
- Uploader: `npm start`

## 3. Smoke checklist

- [ ] `GET /health` нода
- [ ] `GET /health` uploader
- [ ] OpenAPI доступен (если не отключён в prod)

## 4. Откат

- …

## 5. Наблюдаемость

- Пути логов ноды / uploader
