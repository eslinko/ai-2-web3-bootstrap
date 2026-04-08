# Inter-service security — {{PROJECT_NAME}}

## Channels

| Channel | Protection mode | Decision |
|---------|------------------|----------|
| node -> uploader | upload token / signed payload contract | `security.upload_token_mode`, `security.arweave_signing_mode` |
| uploader -> node callback/status | bearer / hmac / none | `security.edge_auth_mode` |
| wallet -> node sign APIs | wallet auth / fallback | `security.wallet_auth_mode` |
| GPT -> node | bearer / none | `security.gpt_actions_protection` |

## Endpoint groups

- `/activities`, `/reference`
- `/v1/uploads/*`
- `/v1/pending-sign-requests`
- `/v1/sign-requests/*`
- `/v1/wallet-auth/*`

## Notes

- Keep exact endpoint auth mapping in project docs (`api.md`/OpenAPI link).
