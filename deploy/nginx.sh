#!/usr/bin/env bash
# Deploy the HOST nginx config to the server and apply it.
#
#   npm run deploy:nginx        or        ./deploy/nginx.sh
#
# Runs: rsync nginx/ -> img:/srv/img-server/nginx/ , then
#       sudo /srv/img-server/nginx/setup.sh  (installs conf.d, nginx -t, reload).
# setup.sh is idempotent and never clobbers the certbot-owned _server.conf.
set -euo pipefail

HOST="${DEPLOY_HOST:-img}"
DEST="/srv/img-server"
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo ">> rsync nginx/ -> ${HOST}:${DEST}/nginx/"
rsync -az \
  --exclude '*.log' \
  "$SRC/nginx/" "${HOST}:${DEST}/nginx/"

echo ">> applying nginx config on ${HOST} (sudo setup.sh)"
ssh "$HOST" "sudo ${DEST}/nginx/setup.sh"

echo ">> nginx deployed + reloaded"
