# Security architecture (bootstrap reference)

## 1. Контуры безопасности в системе

- HMAC контур для commerce/partner API.
- Bearer контур для GPT Actions и межсервисных callbacks.
- JWT RS256 контур для `upload_token`.
- Wallet-auth контур challenge + signature.
- Arweave signing контур (JWK/Data Item).
- EVM signing контур (node key / wallet runner / external wallet later).
- Secrets source контур (env / vault / hybrid).

## 2. Каналы взаимодействия

| Канал | Контур |
|-------|--------|
| GPT -> node (`/activities`, `/reference`) | Bearer (или none по решению) |
| Edge/uploader -> node (`/v1/uploads/*`) | shared bearer / hmac / none |
| wallet -> node (`/v1/pending-sign-requests`, `/v1/sign-requests`) | wallet-auth + fallback policy |
| node -> uploader crystalization flow | JWT upload token + signed payload contract |

## 3. Где какой механизм используется

- API middleware: HMAC/Bearer.
- Upload flow: JWT upload token + edge auth.
- Wallet flow: challenge_signature + EVM/Arweave signing boundaries.
- Deploy/chain flow: EVM private key material.
- Secrets flow: env groups и/или Vault contract.

## 4. Как они связаны

- Контуры независимы и принимаются отдельными decisions.
- Summary хранит `security.*` + `generate.security_*`.
- Output selection и generation plan включают docs/env/code/tasks по каждому контуру.

## 5. Что reusable

- Раздельные auth контракты по каналам.
- Security switches в generation pipeline.
- Шаблоны docs/env/code boundaries для контуров.

## 6. Что project-specific

- Точный набор endpoint префиксов.
- Конкретные названия переменных и fallback-приоритеты.
- Конкретная комбинация mode-решений в данном проекте.
