# Signing architecture — {{PROJECT_NAME}}

## Signing modes

| Domain | Decision | Active mode |
|--------|----------|-------------|
| Upload token | `security.upload_token_mode` | `jwt_rs256` / `none` |
| Arweave data item | `security.arweave_signing_mode` | `mock_jwk` / `external_signer_later` |
| EVM tx signing | `security.evm_signing_mode` | `node_private_key` / `wallet_mock_runner` / `external_wallet_later` |
| Wallet auth challenge | `security.wallet_auth_mode` | `challenge_signature` / `none` |

## Flows (fill using project summary)

1. Draft/prepare -> upload token issuance -> crystalize.
2. `sign_arweave` path -> uploader -> callback.
3. `sign_contract` path -> node submit/broadcast.
4. Wallet challenge/verify path (if enabled).

## Constraints

- Arweave and EVM key materials are separate.
- JWT keys for upload_token are separate from bearer and HMAC secrets.
