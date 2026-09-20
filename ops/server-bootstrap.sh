#!/usr/bin/env bash
set -Eeuo pipefail

PUBLIC_HOST="${1:?Usage: server-bootstrap.sh PUBLIC_HOST AUTHORIZED_KEY_FILE}"
AUTHORIZED_KEY_FILE="${2:?Usage: server-bootstrap.sh PUBLIC_HOST AUTHORIZED_KEY_FILE}"
APP_ROOT="/opt/karier"
DEPLOY_USER="deploy"
SERVICE="karier.service"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run this script as root." >&2
  exit 1
fi

if [[ ! -s "$AUTHORIZED_KEY_FILE" ]]; then
  echo "Authorized SSH public key not found: $AUTHORIZED_KEY_FILE" >&2
  exit 1
fi

if [[ ! "$PUBLIC_HOST" =~ ^[A-Za-z0-9.-]+$ ]]; then
  echo "PUBLIC_HOST must be a DNS name or IPv4 address." >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl nginx openssh-server util-linux

if ! command -v node >/dev/null 2>&1 || [[ "$(node -p 'process.versions.node.split(".")[0]')" -lt 22 ]]; then
  curl --fail --silent --show-error https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  useradd --create-home --shell /bin/bash "$DEPLOY_USER"
fi

install -d -o "$DEPLOY_USER" -g "$DEPLOY_USER" -m 750 \
  "$APP_ROOT" "$APP_ROOT/releases"
install -d -o "$DEPLOY_USER" -g "$DEPLOY_USER" -m 700 \
  "/home/$DEPLOY_USER/.ssh"
install -o "$DEPLOY_USER" -g "$DEPLOY_USER" -m 600 \
  "$AUTHORIZED_KEY_FILE" "/home/$DEPLOY_USER/.ssh/authorized_keys"

cat > "/etc/systemd/system/$SERVICE" <<EOF
[Unit]
Description=Karier Next.js website
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=$DEPLOY_USER
Group=$DEPLOY_USER
WorkingDirectory=$APP_ROOT/current
Environment=NODE_ENV=production
Environment=HOSTNAME=127.0.0.1
Environment=PORT=3000
ExecStart=/usr/bin/npm run start -- --hostname 127.0.0.1 --port 3000
Restart=always
RestartSec=3
KillSignal=SIGTERM
TimeoutStopSec=30
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/sudoers.d/karier-deploy <<EOF
$DEPLOY_USER ALL=(root) NOPASSWD: /usr/bin/systemctl restart $SERVICE
EOF
chmod 440 /etc/sudoers.d/karier-deploy
visudo -cf /etc/sudoers.d/karier-deploy

cat > /etc/nginx/sites-available/karier <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $PUBLIC_HOST;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF

ln -sfn /etc/nginx/sites-available/karier /etc/nginx/sites-enabled/karier
rm -f /etc/nginx/sites-enabled/default
nginx -t

systemctl daemon-reload
systemctl enable nginx "$SERVICE"
systemctl restart nginx

echo "Bootstrap complete. Node: $(node --version)"
echo "The first application release can now be deployed by GitHub Actions."
