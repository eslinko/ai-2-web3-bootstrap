# Verification model — {{PROJECT_NAME}}

## Режим (`uploader.verification_mode`)

| Значение | Обязательные проверки |
|----------|------------------------|
| `signed_data_item_required` | JWT/токен (если в контуре) + парсинг Data Item + проверка RSA-PSS + тег `Upload-Id`. |
| `token_only` | Только capability token (редкий упрощённый профиль; **не** эталонный полный Floou). |
| `mixed` | Явно перечислить, что включено (например токен + обязательная подпись Item). |

## Эталонная последовательность (Floou)

1. **Token gate:** signature, `exp`, `upload_id` == body, `payload_size` <= `max_bytes`.
2. **Data Item gate:** декодирование, валидная структура ANS-104, подпись совпадает с owner, тег `Upload-Id` совпадает с `upload_id`.
3. Только после успеха оба шага — переход к publish.

## Граница wallet / uploader

- **Wallet (или mock-runner):** формирует байты подписанного Data Item.
- **Uploader:** не подписывает от имени пользователя контент; **проверяет** криптографию и привязку к upload.

## Где uploader «доверяет» upstream

- Uploader **не** заменяет node: не решает бизнес-допустимость доменных полей внутри data, если это не вынесено в контракт слоя `payload_contract_mode`.
