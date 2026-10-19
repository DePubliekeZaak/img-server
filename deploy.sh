#!/usr/bin/env bash
# Deploy img-server to the droplet with rsync.
#
#   ./deploy.sh                  # rsync only (default — uses existing build artifacts)
#   ./deploy.sh --build          # build (node + cli) first, then rsync to img:/srv/img-server/
#   ./deploy.sh --delete         # mirror: remove files on the server that are gone from the repo
#   ./deploy.sh --dry-run        # print what rsync/scp would do, change nothing
#
# WHAT IT DOES
#   1. (only with --build) builds the parts that need compiling:
#        - node/ -> node/dist   (tsc; the importer Docker image is built from this on the server)
#        - cli/  -> cli/img     (tsc + esbuild + pkg; needs `cd cli && npm install` once)
#   2. rsyncs the repo to ${DEPLOY_HOST:-img}:/srv/img-server/
#   3. copies the compiled CLI binary to /srv/img-server/cli/img (user-writable);
#      put it on the server PATH yourself with:
#        ssh img "sudo install -m 0755 /srv/img-server/cli/img /usr/bin/img"
#
# SERVER-SIDE SECRETS ARE NEVER TOUCHED
#   docker/.env and node/.env are excluded — the server keeps its own copies,
#   and --delete never removes them either.
#
# AFTER DEPLOYING (run on the server)
#   - nginx changes:  sudo /srv/img-server/nginx/setup.sh
#   - docker changes: cd /srv/img-server/docker && sudo docker compose up -d
set -euo pipefail
set -E

# On any failure, say WHERE and WHY instead of dying without a trace.
trap 'rc=$?
    echo "" >&2
    echo "!! deploy.sh failed (exit $rc) at line ${BASH_LINENO[0]}" >&2
    echo "   command: $BASH_COMMAND" >&2
    echo "   hint: if this is the rsync step, check \"ssh img\" works and DEPLOY_HOST is reachable" >&2
    exit $rc' ERR

HOST="${DEPLOY_HOST:-img}"
DEST="/srv/img-server"
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

DO_BUILD=0
MIRROR=""
DRY_RUN=""

for arg in "$@"; do
    case "$arg" in
        --build)      DO_BUILD=1 ;;
        --delete)     MIRROR="--delete" ;;
        --dry-run)    DRY_RUN=1 ;;
        *) echo "unknown option: $arg" >&2; exit 1 ;;
    esac
done

# 1) builds (only on request — default is to redeploy existing artifacts)
if [ "${DO_BUILD:-0}" -eq 1 ]; then
    echo ">> building node -> node/dist"
    ( cd "$SRC/node" && npm run build )
    echo ">> building cli -> cli/img"
    ( cd "$SRC/cli" && npm run build \
        && npx esbuild ./build/cli.js --bundle --outfile=img-cli.cjs --format=cjs --platform=node \
        && npx pkg img-cli.cjs --targets node16-linux-x64 --output img )
else
    echo ">> no --build: using existing build artifacts"
fi

# 2) rsync the repo
echo ">> rsync ${MIRROR:-"(merge, no --delete)"}  $SRC/ -> ${HOST}:${DEST}/"
rsync -avz $MIRROR ${DRY_RUN:+-n} \
    --exclude '.git/' \
    --exclude 'node_modules/' \
    --exclude 'node/.env' \
    --exclude 'docker/.env' \
    --exclude 'cli/build/' \
    --exclude 'cli/img-cli.cjs' \
    --exclude 'cli/img' \
    --exclude '*.log' \
    --exclude '.DS_Store' \
    "$SRC/" "${HOST}:${DEST}/"

# 3) copy the CLI binary into /srv/img-server (user-writable) — /usr/bin needs sudo
# if [ -f "$SRC/cli/img" ]; then
#     if [ -n "$DRY_RUN" ]; then
#         echo ">> [dry-run] would scp $SRC/cli/img ${HOST}:${DEST}/cli/img"
#     else
#         echo ">> copying CLI binary -> ${HOST}:${DEST}/cli/img"
#         scp "$SRC/cli/img" "${HOST}:${DEST}/cli/img"
#     fi
#     echo ">> on the server, put it on the PATH with:"
#     echo "     ssh ${HOST} \"sudo install -m 0755 ${DEST}/cli/img /usr/bin/img\""
# else
#     echo "!! cli/img not found - build it first (drop --skip-build, or: cd cli && npm install && npm run cli)" >&2
# fi

echo ">> done."
