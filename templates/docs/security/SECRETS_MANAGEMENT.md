# Secrets management — {{PROJECT_NAME}}

## Decision

- `security.secrets_source`: `{{security.secrets_source}}` (`env_only` / `vault` / `hybrid`)

## Secret groups

- HMAC secrets
- Bearer secrets (GPT / Edge)
- JWT keys (upload token private/public)
- Arweave JWK
- EVM private keys
- Vault access (`VAULT_*`) if enabled

## Storage contract

| Group | Source | Rotation owner |
|-------|--------|----------------|
| HMAC | env / vault | {{owner_hmac}} |
| GPT Bearer | env / vault | {{owner_gpt}} |
| Edge auth | env / vault | {{owner_edge}} |
| JWT keys | env files / vault | {{owner_jwt}} |
| Arweave JWK | env file / vault | {{owner_arweave}} |
| EVM keys | env / vault | {{owner_evm}} |

## Notes

- Template contains classes of variables only; no real secrets.
