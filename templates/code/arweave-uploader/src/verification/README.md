# Verification boundary

- Валидация `upload_token` (JWT RS256 в эталоне).
- Валидация подписанного ANS-104 Data Item и тега `Upload-Id`.

**Controlled by:** `uploader.verification_mode`, `security.upload_token_mode` (согласование с node)
