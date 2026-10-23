#!/usr/bin/env bash
# Run once as root on the production server. Does not change deployment rights.
set -Eeuo pipefail

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root: sudo bash ops/enable-http2.sh" >&2
  exit 1
fi

CONFIG="$(readlink -f /etc/nginx/sites-enabled/karier)"
case "$CONFIG" in
  /etc/nginx/sites-available/karier|/etc/nginx/sites-enabled/karier) ;;
  *) echo "Unexpected nginx config path: $CONFIG" >&2; exit 1 ;;
esac

nginx -t
nginx -V 2>&1 | grep -q -- '--with-http_v2_module'
grep -Eq 'server_name[^;]*tverplazh\.ru' "$CONFIG"
grep -q '/etc/letsencrypt/live/tverplazh.ru/fullchain.pem' "$CONFIG"

if grep -Eq '^[[:space:]]*http2[[:space:]]+on;' "$CONFIG"; then
  echo "HTTP/2 is already enabled in the site configuration."
  exit 0
fi

# Fail closed if the observed single TLS block has been reorganized.
if [[ "$(grep -Ec '^[[:space:]]*listen 443 ssl;' "$CONFIG")" -ne 1 ]]; then
  echo "Expected one 'listen 443 ssl;' directive; inspect the config first." >&2
  exit 1
fi

BACKUP="$(mktemp "${CONFIG}.before-http2.XXXXXX")"
cp -p -- "$CONFIG" "$BACKUP"
restore() {
  cp -p -- "$BACKUP" "$CONFIG"
  nginx -t && systemctl reload nginx
}
trap 'restore' ERR
sed -i '/^[[:space:]]*listen 443 ssl;/i\    http2 on;' "$CONFIG"
nginx -t
systemctl reload nginx

PROTOCOL=""
# nginx reload is asynchronous; an immediate connection can reach an old worker.
for attempt in 1 2 3 4 5; do
  sleep 1
  PROTOCOL="$(curl --noproxy '*' --fail --silent --show-error --http2 \
    --resolve tverplazh.ru:443:127.0.0.1 --max-time 15 \
    -o /dev/null -w '%{http_version}' https://tverplazh.ru/)"
  printf 'Attempt %s: HTTP/%s\n' "$attempt" "$PROTOCOL"
  if [[ "$PROTOCOL" == "2" ]]; then break; fi
done
if [[ "$PROTOCOL" != "2" ]]; then
  echo "Expected HTTP/2, got $PROTOCOL; restoring previous config." >&2
  restore
  exit 1
fi
trap - ERR
printf 'HTTP/2 verified. Previous config: %s\n' "$BACKUP"
