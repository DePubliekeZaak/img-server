#!/usr/bin/env bash
# Build the node importer, ship it to the server, rebuild + restart the
# importer container.
#
#   npm run deploy:node         or        ./deploy/node.sh
#
# Runs: npm run build (node/dist), rsync node/ -> img:/srv/img-server/node/ ,
#       then sudo docker compose up -d --build importer.
# node/.env holds server-side secrets and is never synced.
set -euo pipefail

HOST="${DEPLOY_HOST:-img}"
DEST="/srv/img-server"
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo ">> building node -> node/dist"
( cd "$SRC/node" && npm run build )

echo ">> rsync node/ -> ${HOST}:${DEST}/node/"
rsync -az \
  --exclude 'node_modules/' \
  --exclude 'package-lock.json' \
  --exclude '.env' \
  --exclude 'dist/src/' \
  "$SRC/node/" "${HOST}:${DEST}/node/"

echo ">> rebuild + restart importer on ${HOST}"
ssh "$HOST" "cd ${DEST}/docker && sudo docker compose up -d --build importer"

echo ">> importer deployed"
