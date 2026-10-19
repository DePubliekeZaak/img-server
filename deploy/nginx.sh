#!/usr/bin/env bash
# Move nginx/ to the server. Nothing else.
set -euo pipefail
HOST="${DEPLOY_HOST:-img}"
rsync -az --exclude '*.log' "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/nginx/" "${HOST}:/srv/img-server/nginx/"
