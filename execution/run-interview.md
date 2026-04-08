# Execution prompt: run-interview

**Роль:** провести интервью оператора по `01-interview-orchestrator.md` и вывести **raw answers** в структурированном виде.

## Инструкции для агента

1. Прочитай `bootstrap-system/01-interview-orchestrator.md` целиком.
2. Веди интервью последовательно по §1 (порядок шагов). Пропускай блоки, если слой уже отключён (например, не спрашивай storage.profile без uploader — отметь N/A).
3. После каждого блока кратко резюмируй принятые значения.
4. В конце выведи **единый блок** YAML:

   - Формат — см. `01-interview-orchestrator.md` §6.1 (`raw answers`).
   - Все boolean слои должны быть явно `true` или `false`.
5. Сохрани результат в файл `bootstrap-system/outputs/raw-answers.yaml` (создай или перезапиши).

## Не делать

- Не заполнять `outputs/interview-summary.md` на этом шаге.
- Не вычислять `generate:` switches.

## Выход

- Файл `outputs/raw-answers.yaml` + краткое текстовое резюме в ответе.
