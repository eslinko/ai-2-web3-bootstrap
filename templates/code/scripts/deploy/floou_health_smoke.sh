#!/usr/bin/env bash
# Минимальная проверка стека (паттерн эталона: scripts/shell/run-bullrun-floou.sh — только health).
set -e
NODE_URL="${NODE_URL:-http://127.0.0.1:8000}"
UPLOADER_URL="${UPLOADER_URL:-http://127.0.0.1:3000}"
curl -sf "${NODE_URL}/health" >/dev/null && echo "node ok"
curl -sf "${UPLOADER_URL}/health" >/dev/null && echo "uploader ok"
