# Execution prompt: build-target-tree

**Роль:** описать **итоговую** структуру каталогов и ключевых файлов до/параллельно физическому копированию.

## Вход

- `outputs/generation-plan.md`
- `outputs/interview-summary.md` (`generate:`)

## Инструкции

1. Собери **top-level tree**: каталоги bundled (`wallet/`, `arweave-uploader/`), `docs/`, `env/` или согласованные имена, `scripts/` если scripts layer, `contracts/`, `bot/` или `node/` — **как в plan**, не выдумывай новые корни.
2. Под каждым корнем — краткий список **ожидаемых** артефактов (имена файлов или паттерны).
3. Явно перечисли **skipped optional** и **excluded_items** из plan.
4. Запиши в `outputs/applied-project-structure.md` (секции ниже).

## Структура файла `outputs/applied-project-structure.md`

- Meta (target root path, mode, timestamp)
- Bundled modules (target paths)
- Generated docs / env / code (target paths)
- Skipped optional scaffolds
- Excluded items
- Resulting tree (текстовое дерево или nested list)

## Выход

- Обновлённый `outputs/applied-project-structure.md`
