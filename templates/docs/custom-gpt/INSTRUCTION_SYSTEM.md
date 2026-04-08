# Instruction system — {{PROJECT_NAME}}

## 1. Иерархия (эталон: `instruction-modules-index.md`)

| Уровень | Файл | Роль |
|---------|------|------|
| Root wrapper | `root.md` | Политика, запреты, приоритет при конфликте |
| Base | `base.md` | Режимы, статусы, privacy |
| Модули | `*.md` | Ingest, normalizer, gate, API orchestrator, … |

## 2. Модульный индекс

Заполните список модулей и сценариев активации.

## 3. Конфликты

- Root > Base > модуль

## 4. Hooks

- Новый модуль = новый файл + запись в индексе
