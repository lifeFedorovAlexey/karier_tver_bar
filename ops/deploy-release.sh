#!/usr/bin/env bash
set -Eeuo pipefail

VERSION="${1:?Usage: deploy-release.sh VERSION ARCHIVE}"
ARCHIVE="${2:?Usage: deploy-release.sh VERSION ARCHIVE}"
APP_ROOT="/opt/karier"
RELEASES_DIR="$APP_ROOT/releases"
CURRENT_LINK="$APP_ROOT/current"
SERVICE="karier.service"
CANARY_PORT="3100"
HEALTH_PATH="/contacts"
RELEASE_DIR="$RELEASES_DIR/$VERSION"
CANARY_PID=""
PREVIOUS=""

if [[ "$(id -un)" != "deploy" ]]; then
  echo "This script must run as the deploy user." >&2
  exit 1
fi

if [[ ! "$VERSION" =~ ^[0-9a-f]{40}$ ]]; then
  echo "VERSION must be a full Git commit SHA." >&2
  exit 1
fi

if [[ ! -f "$ARCHIVE" ]]; then
  echo "Release archive not found: $ARCHIVE" >&2
  exit 1
fi

if [[ "$ARCHIVE" != /tmp/karier-*.tar.gz ]]; then
  echo "Release archive must be under /tmp and use the karier-*.tar.gz name." >&2
  exit 1
fi

cleanup_canary() {
  if [[ -n "$CANARY_PID" ]] && kill -0 "$CANARY_PID" >/dev/null 2>&1; then
    kill -TERM -- "-$CANARY_PID" >/dev/null 2>&1 || kill -TERM "$CANARY_PID" >/dev/null 2>&1 || true
    for _ in {1..10}; do
      kill -0 "$CANARY_PID" >/dev/null 2>&1 || break
      sleep 1
    done
    kill -KILL -- "-$CANARY_PID" >/dev/null 2>&1 || kill -KILL "$CANARY_PID" >/dev/null 2>&1 || true
  fi
  if [[ -n "$CANARY_PID" ]]; then
    wait "$CANARY_PID" >/dev/null 2>&1 || true
  fi
  CANARY_PID=""
}

cleanup_archive() {
  rm -f -- "$ARCHIVE"
}

trap 'cleanup_canary; cleanup_archive' EXIT

wait_for_health() {
  local port="$1"
  local attempts="${2:-30}"
  local attempt=1

  while [[ "$attempt" -le "$attempts" ]]; do
    if curl --fail --silent --show-error --max-time 5 \
      "http://127.0.0.1:$port$HEALTH_PATH" >/dev/null; then
      printf '[deploy] health ok on port %s (attempt %s/%s)\n' \
        "$port" "$attempt" "$attempts"
      return 0
    fi
    sleep 2
    attempt=$((attempt + 1))
  done

  return 1
}

rollback() {
  if [[ -z "$PREVIOUS" || ! -d "$PREVIOUS" ]]; then
    echo "No previous release is available for rollback." >&2
    return 1
  fi

  ln -sfn "$PREVIOUS" "$APP_ROOT/current.next"
  mv -Tf "$APP_ROOT/current.next" "$CURRENT_LINK"
  sudo -n /usr/bin/systemctl restart "$SERVICE"
  wait_for_health 3000 30
}

if [[ -L "$CURRENT_LINK" ]]; then
  PREVIOUS="$(readlink -f "$CURRENT_LINK" || true)"
fi

if [[ "$PREVIOUS" == "$RELEASE_DIR" ]]; then
  echo "Release $VERSION is already active."
  exit 0
fi

mkdir -p "$RELEASES_DIR"
tar -tzf "$ARCHIVE" >/dev/null
rm -rf -- "$RELEASE_DIR"
mkdir -p "$RELEASE_DIR"
tar -xzf "$ARCHIVE" -C "$RELEASE_DIR"

if [[ ! -s "$RELEASE_DIR/.next/BUILD_ID" ]]; then
  echo "The release does not contain a production Next.js build." >&2
  exit 1
fi

if [[ ! -x "$RELEASE_DIR/node_modules/.bin/next" ]]; then
  echo "The release does not contain its runtime dependencies." >&2
  exit 1
fi

CANARY_LOG="$RELEASE_DIR/canary.log"
cd "$RELEASE_DIR"
setsid /usr/bin/npm run start -- --hostname 127.0.0.1 --port "$CANARY_PORT" \
  >"$CANARY_LOG" 2>&1 &
CANARY_PID=$!

if ! wait_for_health "$CANARY_PORT" 30; then
  echo "Canary health-check failed for $VERSION." >&2
  tail -n 100 "$CANARY_LOG" >&2 || true
  exit 1
fi
cleanup_canary

ln -sfn "$RELEASE_DIR" "$APP_ROOT/current.next"
mv -Tf "$APP_ROOT/current.next" "$CURRENT_LINK"

if ! sudo -n /usr/bin/systemctl restart "$SERVICE"; then
  echo "Production service failed to restart; rolling back." >&2
  rollback || true
  exit 1
fi

if ! wait_for_health 3000 30; then
  echo "Production health-check failed for $VERSION; rolling back." >&2
  rollback || true
  exit 1
fi

while IFS= read -r old_release; do
  case "$old_release" in
    "$RELEASES_DIR"/20*) rm -rf -- "$old_release" ;;
  esac
done < <(
  find "$RELEASES_DIR" -mindepth 1 -maxdepth 1 -type d -name '[0-9a-f]*' \
    -printf '%T@ %p\n' | sort -nr | tail -n +6 | cut -d' ' -f2-
)

echo "Deployed $VERSION successfully."
