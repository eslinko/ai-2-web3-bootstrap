# Security overview — {{PROJECT_NAME}}

## Decisions snapshot

- `security.api_auth_mode`: `{{security.api_auth_mode}}`
- `security.gpt_actions_protection`: `{{security.gpt_actions_protection}}`
- `security.edge_auth_mode`: `{{security.edge_auth_mode}}`
- `security.upload_token_mode`: `{{security.upload_token_mode}}`
- `security.wallet_auth_mode`: `{{security.wallet_auth_mode}}`
- `security.arweave_signing_mode`: `{{security.arweave_signing_mode}}`
- `security.evm_signing_mode`: `{{security.evm_signing_mode}}`
- `security.secrets_source`: `{{security.secrets_source}}`

## Active security contours

- HMAC contour (commerce / partner integration)
- Bearer contour (GPT Actions and/or edge callbacks)
- JWT RS256 contour (`upload_token`) when enabled
- Wallet-auth contour (challenge + signature) when enabled
- Arweave signing contour (JWK / external signer)
- EVM signing contour (node key / wallet mock runner / external wallet)

## Boundaries

- This project does not collapse all channels into one auth mechanism.
- Secrets are represented as env groups; real values are external to templates.
