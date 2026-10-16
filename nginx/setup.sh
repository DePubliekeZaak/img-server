#!/usr/bin/env bash
# Install img's nginx on the HOST.
#
#   sudo ./setup.sh
#
# What it does (idempotent — safe to re-run any time):
#   1. ensures nginx is installed + enabled
#   2. installs nginx.conf, _server.conf (once), __upstreams.conf, *.locations
#   3. validates with `nginx -t` and restarts nginx
#
# _server.conf is NO-CLOBBER: after the first install, certbot --nginx owns that
# file (it adds the 443/ssl + redirect blocks there). Re-running this script
# NEVER overwrites it, so certbot's TLS config survives — there is no
# "re-run wipes HTTPS" trap anymore.
#
#   Reset _server.conf (e.g. changed hostnames, or want certbot to re-add 443):
#       sudo rm -f /etc/nginx/conf.d/_server.conf && sudo ./setup.sh
#   ...then re-run the certbot --nginx command to regenerate the TLS blocks.
#
# NOTE: hostnames are hardcoded in conf.d/_server.conf — the docker .env is NOT
# needed by nginx (no DOMAIN/DOMAIN2 vars anymore).
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 1) nginx present?
if ! command -v nginx >/dev/null 2>&1; then
	echo ">> installing nginx"
	apt-get update
	apt-get install -y nginx
fi
systemctl enable nginx >/dev/null 2>&1 || true

# 2) install config
echo ">> installing config"
install -d /etc/nginx/conf.d/img /etc/nginx/conf.d/graphs
install -m 0644 "$SRC/nginx.conf" /etc/nginx/nginx.conf
if [ ! -f /etc/nginx/conf.d/_server.conf ]; then
	echo ">> creating /etc/nginx/conf.d/_server.conf (certbot owns it after first run)"
	install -m 0644 "$SRC/conf.d/_server.conf" /etc/nginx/conf.d/_server.conf
else
	echo ">> keeping existing /etc/nginx/conf.d/_server.conf (certbot-managed — rm + rerun to regenerate)"
fi
install -m 0644 "$SRC/conf.d/__upstreams.conf" /etc/nginx/conf.d/__upstreams.conf
install -m 0644 "$SRC"/conf.d/img/*.locations /etc/nginx/conf.d/img/
install -m 0644 "$SRC"/conf.d/graphs/*.locations /etc/nginx/conf.d/graphs/

# 3) validate + start
echo ">> nginx -t"
nginx -t
echo ">> restarting nginx"
systemctl restart nginx
echo ">> active server blocks:"
nginx -T | grep -E "server_name|listen" | sort -u
