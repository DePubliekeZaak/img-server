#!/usr/bin/env bash
# Deploy the docker compose stack to the server and (re)start it.
#
#   npm run deploy:docker        or        ./deploy/docker.sh
#
# Runs: rsync docker/ -> img:/srv/img-server/docker/ , then
#       sudo docker compose up -d  (in /srv/img-server/docker).
# docker/.env holds server-side secrets and is never synced.
set -euo pipefail

HOST="${DEPLOY_HOST:-img}"
DEST="/srv/img-server"
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo ">> rsync docker/ -> ${HOST}:${DEST}/docker/"
rsync -az \
  --exclude '.env' \
  "$SRC/docker/" "${HOST}:${DEST}/docker/"

echo ">> docker compose up -d on ${HOST}"
ssh "$HOST" "cd ${DEST}/docker && sudo docker compose up -d"

echo ">> docker stack up"
