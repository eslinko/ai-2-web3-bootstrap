# Environment — {{PROJECT_NAME}}

## 1. Профили

| Профиль | Назначение | Особенности секретов |
|---------|------------|------------------------|
| local | Разработка | ключи в `.env`, mock uploader |
| staging | | |
| production | | Vault / secret manager |

## 2. Файлы env (эталон: монорепо)

- Корень: `templates/env/root.env.example` → `.env`
- Нода: `templates/env/node.env.example`
- Uploader: `templates/env/arweave.env.example`
- Каталог: `templates/env/shared-vars-catalog.md`

## 3. Обязательные переменные по контуру

Заполните после интервью; не дублируйте секреты в документах.

## 4. Ключи

- Генерация: см. `templates/keys/README.md`
- Никогда не коммитить материалы ключей

## 5. Риски

- Несовпадение Bearer между uploader и нодой → 401 на callback
