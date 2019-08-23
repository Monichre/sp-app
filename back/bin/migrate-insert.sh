# #!/bin/bash

# : "${SOURCE_TARGET:?Need to set SOURCE_TARGET}"
# : "${SOURCE_CONFIG:?Need to set SOURCE_CONFIG}"
# : "${DEST_TARGET:?Need to set DEST_TARGET}"
# : "${DEST_CONFIG:?Need to set DEST_CONFIG}"

# echo "* Migrating from $SOURCE_TARGET $SOURCE_CONFIG to $DEST_TARGET $DEST_CONFIG"

# # rm -rf ../.tmp/tmp-TableUser.json
# # rm -rf ../.tmp/tmp-TablePlay.json
# # rm -rf ../.tmp/tmp-TableAchievement.json

# echo "* Cleaned up ../.tmp/tmp-*.json"

# # echo "*1/6 Downloading users..."
# # TARGET=$SOURCE_TARGET CONFIG=$SOURCE_CONFIG source ./bin/remote-env.sh && TARGET=$SOURCE_TARGET CONFIG=$SOURCE_CONFIG TABLE=TableUser ts-node ./bin/dump-table.ts > ../.tmp/tmp-TableUser.json
# # echo "*1/6 ...downloaded users"

# # echo "*2/6 Uploading users..."
# # TARGET=$DEST_TARGET CONFIG=$DEST_CONFIG source ./bin/remote-env.sh && TARGET=$DEST_TARGET CONFIG=$DEST_CONFIG ts-node ./bin/put-users.ts ../.tmp/tmp-TableUser.json
# # echo "*2/6 ...uploaded users"

# # echo "*3/6 Downloading plays..."
# # TARGET=$SOURCE_TARGET CONFIG=$SOURCE_CONFIG source ./bin/remote-env.sh && TARGET=$SOURCE_TARGET CONFIG=$SOURCE_CONFIG TABLE=TablePlay ts-node ./bin/dump-table.ts > ../.tmp/tmp-TablePlay.json
# # echo "*3/6 ...downloaded plays"

# # echo "*4/6 Uploading plays..."
# # TARGET=$DEST_TARGET CONFIG=$DEST_CONFIG source ./bin/remote-env.sh && TARGET=$DEST_TARGET CONFIG=$DEST_CONFIG ts-node ./bin/put-plays.ts ../.tmp/tmp-TablePlay.json
# # echo "*4/6 ...uploading plays"

# echo "*5/6 Downloading stats..."
# TARGET=$SOURCE_TARGET CONFIG=$SOURCE_CONFIG source ./bin/remote-env.sh && TARGET=$SOURCE_TARGET CONFIG=$SOURCE_CONFIG TABLE=TableStat yarn ts-node ./bin/dump-table.ts > ./stats.json
# echo "*5/6 ...downloaded stats"

# # echo "*5/6 Downloading achievements..."
# # TARGET=$SOURCE_TARGET CONFIG=$SOURCE_CONFIG source ./bin/remote-env.sh && TARGET=$SOURCE_TARGET CONFIG=$SOURCE_CONFIG TABLE=TableAchievement yarn ts-node ./bin/dump-table.ts > ./achievements.json
# # echo "*5/6 ...downloaded achievements"

# # ../.tmp/tmp-TableAchievement.json
# # echo "*/6 Uploading achievements..."
# # TARGET=$DEST_TARGET CONFIG=$DEST_CONFIG source ./bin/remote-env.sh && TARGET=$DEST_TARGET CONFIG=$DEST_CONFIG ts-node ./bin/put-achievements.ts ../.tmp/tmp-TableAchievement.json
# # echo "*6/6 ...uploading achievements"