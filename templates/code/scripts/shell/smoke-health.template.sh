#!/usr/bin/env bash
# Template: health checks for node / uploader. No secrets in file — use env.
set -euo pipefail

NODE_URL="${NODE_URL:-http://127.0.0.1:8000}"
UPLOADER_URL="${UPLOADER_URL:-http://127.0.0.1:3000}"

curl -sf "${NODE_URL}/health" >/dev/null && echo "node ok"
curl -sf "${UPLOADER_URL}/health" >/dev/null && echo "uploader ok"
