import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import { verifyEnv } from '../src/shared/env';
import { slog } from '../src/fns/logger';
import { QueueEnrichPlayArtists } from '../src/shared/queues';
import { TableUser } from '../src/shared/tables/TableUser';
import * as R from 'ramda'
const log = slog.child({handler: 'publish-enrich', awsEvent: 'script'})

const script = async () => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DynamoEndpoint,
    QUEUE_ENRICH: process.env.QueueEnrichPlayArtists,
    TABLE_USER: process.env.TableUser,
  }, log)
  
  // const doc = new AWS.DynamoDB.DocumentClient({endpoint: env.DYNAMO_ENDPOINT, region: 'us-east-1'})

  const items = JSON.parse(fs.readFileSync(process.argv[process.argv.length-1]).toString())
  log.info(`${items.length} items to publish`)
  // const items = require(process.argv[process.argv.length-1])

  const tableUser = TableUser(env.DYNAMO_ENDPOINT, env.TABLE_USER, log)
  const credCache: {[k: string]: { accessToken: string, refreshToken: string, utcOffset: number}} = {}

  const uids = R.uniq<string>(items.map(i => i.pk))
  log.info('collecting creds for', { uids })
  for (const uid of uids) {
    const { valid, invalid } = await tableUser.getUser(uid)
    if (valid) {
      credCache[uid] = valid
      log.info('found user credentials for', { uid })
    }
    if (invalid) {
      log.error('unable to get user credentials, will not replay', { uid })
    }
  }
  log.info('collected user credentials', { credCache })

  let processed = 0
  let skipped = 0
  for (const item of items) {
    const uid = item.pk as string
    
    const user = credCache[uid]
    if (!user) {
      log.warn('cannot add play for user without creds', { uid })
      skipped += 1
      continue
    }
    const { accessToken, refreshToken, utcOffset } = user
    
    const playedAt = item.playedAt as string
    const track = JSON.parse(item.track)
    await QueueEnrichPlayArtists.publish(env.QUEUE_ENRICH, {
      user: {
        uid,
        accessToken,
        refreshToken,
        utcOffset,
      },
      plays: [ { played_at: playedAt, track }],
    })
    processed += 1
    log.info(`progress ${processed + skipped}/${items.length} (${skipped} skips)`)
  }
  // for (const item of items) {
  //   await doc.put({
  //     TableName: env.TABLE_PLAY,
  //     Item: item
  //   }).promise()
  // }

}

script()
  .then(() => { process.exit() })
  .catch(err => {throw err})
