#!/bin/bash

: "${SOURCE_TARGET:?Need to set SOURCE_TARGET}"
: "${SOURCE_CONFIG:?Need to set SOURCE_CONFIG}"
: "${DEST_TARGET:?Need to set DEST_TARGET}"
: "${DEST_CONFIG:?Need to set DEST_CONFIG}"

echo "* Migrating from $SOURCE_TARGET $SOURCE_CONFIG to $DEST_TARGET $DEST_CONFIG"

rm -rf ../.tmp/tmp-TableUser.json
rm -rf ../.tmp/tmp-TablePlay.json
echo "* Cleaned up ../.tmp/tmp-*.json"

echo "*1/4 Downloading users..."
TARGET=$SOURCE_TARGET CONFIG=$SOURCE_CONFIG source ./bin/remote-env.sh && TARGET=$SOURCE_TARGET CONFIG=$SOURCE_CONFIG TABLE=TableUser ts-node ./bin/dump-table.ts > ../.tmp/tmp-TableUser.json
echo "*1/4 ...downloaded users"

echo "*2/4 Uploading users..."
TARGET=$DEST_TARGET CONFIG=$DEST_CONFIG source ./bin/remote-env.sh && TARGET=$DEST_TARGET CONFIG=$DEST_CONFIG ts-node ./bin/put-users.ts ../.tmp/tmp-TableUser.json
echo "*2/4 ...uploaded users"

echo "*3/4 Downloading plays..."
TARGET=$SOURCE_TARGET CONFIG=$SOURCE_CONFIG source ./bin/remote-env.sh && TARGET=$SOURCE_TARGET CONFIG=$SOURCE_CONFIG TABLE=TablePlay ts-node ./bin/dump-table.ts > ../.tmp/tmp-TablePlay.json
echo "*3/4 ...downloaded plays"

echo "*4/4 Replaying plays..."
TARGET=$DEST_TARGET CONFIG=$DEST_CONFIG source ./bin/remote-env.sh && TARGET=$DEST_TARGET CONFIG=$DEST_CONFIG ts-node ./bin/publish-enrich.ts ../.tmp/tmp-TablePlay.json
echo "*4/4 ...replayed plays"
