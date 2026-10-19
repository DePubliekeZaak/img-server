#!/usr/bin/env bash
# Move docker/ to the server. docker/.env stays on the server. Nothing else.
set -euo pipefail
HOST="${DEPLOY_HOST:-img}"
rsync -az --exclude '.env' "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/docker/" "${HOST}:/srv/img-server/docker/"
