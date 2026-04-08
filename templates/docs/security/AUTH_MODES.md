# Auth modes — {{PROJECT_NAME}}

## API auth by channel

| Channel | Mode | Decision |
|---------|------|----------|
| Commerce API | HMAC / none | `security.api_auth_mode` |
| GPT Actions (`/activities`, `/reference`) | Bearer / none | `security.gpt_actions_protection` |
| Edge callbacks (`/v1/uploads/*`) | shared bearer / hmac / none | `security.edge_auth_mode` |
| Wallet endpoints (`/v1/pending-sign-requests`, `/v1/sign-requests`) | challenge signature / fallback policy | `security.wallet_auth_mode` |

## Required headers (fill by project)

- HMAC: `X-API-Key`, `X-Timestamp`, `X-Nonce`, `X-Signature`
- Bearer: `Authorization: Bearer <token>`
- Wallet identity (if used): `X-User-Id`, `X-Wallet-Address`

## Notes

- Keep channel-specific auth contracts separate.
- Record any `none` decision in `Risk flags`.
