#!/bin/bash

set -eu

echo "==> Preparing data directory"
mkdir -p /app/data

# secret used to encrypt credentials stored in flows; generated once and kept
# in the backupped data directory so restores keep working
if [[ ! -f /app/data/.credential_secret ]]; then
    echo "==> Generating credential secret"
    openssl rand -hex 32 > /app/data/.credential_secret
    chmod 600 /app/data/.credential_secret
fi

# seed a package.json so palette installs land in /app/data/node_modules
if [[ ! -f /app/data/package.json ]]; then
    echo "==> Seeding package.json"
    cp /app/pkg/package.json.template /app/data/package.json
fi

# keep the npm cache used by palette installs out of the backups
export npm_config_cache=/tmp/npm-cache
export npm_config_update_notifier=false

chown -R cloudron:cloudron /app/data

echo "==> Starting Node-RED"
exec gosu cloudron:cloudron /app/code/node_modules/.bin/node-red --userDir /app/data --settings /app/pkg/settings.js
