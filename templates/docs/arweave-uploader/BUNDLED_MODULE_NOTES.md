# Arweave uploader — bundled module notes

## Поставка

На **primary path** bootstrap v1.8 сервис **arweave-uploader** копируется из эталона **почти целиком** (`uploader.delivery_mode = bundled_module`, default). Это **не** доменная точка кастомизации на старте проекта.

## Стабильное ядро

- HTTP ingress (crystalize-подобный контракт — по эталону).
- Проверка caller trust, `upload_token` (JWT), подписи Data Item (когда включено решениями).
- Publish (mock или real по env) и callback/status к ноде.

Ядро **не переписывать** при каждом новом проекте без архитектурной причины.

## Что кастомизировать

| Область | Как |
|---------|-----|
| Поведение без смены кода | **Env** (`USE_REAL_ARWEAVE`, relay, JWT keys, `BACKEND_URL`, секреты к ноде) |
| Контракт тела и callback | **Payload semantics**, документация интеграции с **node API** |
| Доверие к вызову | Решения **`uploader.caller_auth_mode`** + **`security.*`** |

## Что не делать по умолчанию

- Не собирать uploader заново из **stub-дерева** в `templates/code/arweave-uploader/src/**`, если цель — рабочий сервис; stubs — **optional** для объяснения границ pipeline.

## Документация архитектуры

Управляющая модель слоя (ingress, verification, publish, callback) остаётся в `UPLOADER_ARCHITECTURE.md`, `INGRESS_AND_AUTH.md`, `VERIFICATION_MODEL.md`, `PAYLOAD_CONTRACT.md`, `PUBLISH_AND_CALLBACK.md` — это **рамка**, а не инструкция сгенерировать каждый внутренний файл вручную.

**См.:** `references/uploader-bundled-transition-notes.md`, `references/bundled-modules-strategy.md`.
