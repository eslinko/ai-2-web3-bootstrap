# GPT ingest boundaries

Граница приёма GPT output payload в node слой.

## Responsibilities

- принять JSON от GPT integration layer;
- выполнить базовую структурную проверку;
- передать в `gpt_validation`.

## Decisions

- `gpt.enabled`
- `gpt.output_structure_mode`
