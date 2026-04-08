# Task indexing bridge (bootstrap ↔ bullrun)

Source of truth: `docs/methodology/index-standard-bullrun-fullpower.md`.

## 1. Когда создавать новый `*-index.md`

- Для новой зоны, где нет индекса и есть >=1 task.
- Для выделенной темы внутри зоны (tests/security/deploy и т.п.).

## 2. Когда обновлять существующий индекс

- Если индекс уже есть для зоны/темы — добавлять строку, не дублируя task-текст.

## 3. Как выбирать секции

Секции соответствуют подсистемам (напр. auth, ingest, publish, contracts-core, scripts-shell).  
Одна строка = один task-файл.

## 4. Поля индекса

- **Key:** `<DOMAIN>-<NN>` (3-5 заглавных букв домена).
- **Type:** `fix|tests|implement|refactor|infra|data`.
- **Status:** цифровая шкала 0..3 + кружки.
- **Scope / Notes:** 1-2 предложения, без копирования task details.

## 5. Стартовый статус новых задач

- По умолчанию: **Todo** (`⚪`, код `0`).
- Можно **In Progress** (`🟡`, код `1`), если bootstrap/apply уже частично выполнил часть AC.

## 6. Aggregator-only rule

Индекс хранит ссылки и метаданные.  
Полная постановка живёт только в `task-*.md` по task-standard.

