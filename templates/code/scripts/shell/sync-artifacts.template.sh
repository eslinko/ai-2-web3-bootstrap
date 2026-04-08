#!/usr/bin/env bash
# Template: sync contract artifacts / ABI to consumer path.
# Set SOURCE and TARGET before run (or export in CI).
set -euo pipefail

SOURCE="${SOURCE:?Set SOURCE (e.g. contracts/artifacts)}"
TARGET="${TARGET:?Set TARGET (e.g. packages/app/abi)}"

mkdir -p "${TARGET}"
# Example: adjust globs to your layout
if [[ -d "${SOURCE}" ]]; then
  rsync -a --delete "${SOURCE}/" "${TARGET}/" || cp -R "${SOURCE}/." "${TARGET}/"
else
  echo "SOURCE not found: ${SOURCE}" >&2
  exit 1
fi
echo "Synced ${SOURCE} -> ${TARGET}"
