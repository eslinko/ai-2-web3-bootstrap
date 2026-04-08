# mock-runner — bundled module (инструкция для generation-plan)

## Назначение

Эта папка в **bootstrap templates** не дублирует полный эталонный код. Она задаёт ожидание:

При **`wallet.layer_mode = bundled_mock_runner`** в целевой проект копируется **эталонное** дерево:

`wallet/mock-runner/**` из донорского монорепо (имена путей см. `references/bundled-code-placement-rules.md`).

## Что положить сюда при ручной подготовке шаблона (опционально)

Если команда хранит «золотую копию» mock-runner внутри bootstrap — разместите её под этим каталогом **целиком**, без смешения с `../` stubs. По умолчанию v1.8 предполагает **копирование из эталона**, а не из bootstrap repo.

## Документация и env

- `templates/docs/wallet/*` — обзор, runtime, ограничения.
- `templates/env/wallet-mock.env.example` — классы переменных.

## Связь со stubs в `templates/code/wallet/`

Файлы `*-signer.stub.mjs` и пр. — **вторичный** путь (демонстрация границ). **Primary:** bundled эталонный mock-runner.
