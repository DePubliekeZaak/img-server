#!/usr/bin/env bash
# Move node/ to the server. node/.env stays on the server. Nothing else.
set -euo pipefail
HOST="${DEPLOY_HOST:-img}"
rsync -az \
  --exclude 'node_modules/' \
  --exclude 'package-lock.json' \
  --exclude '.env' \
  --exclude 'dist/src/' \
  "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/node/" "${HOST}:/srv/img-server/node/"
