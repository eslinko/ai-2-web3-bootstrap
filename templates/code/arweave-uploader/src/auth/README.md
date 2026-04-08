# Auth boundary (caller trust)

Проверка доверия к вызывающей стороне на ingress: опциональный relay Bearer, IP policy (вне scope шаблона), и т.д.

**Controlled by:** `uploader.caller_auth_mode`

**Note:** В эталоне также есть контур JWT на `upload_token` — см. `verification/`.
