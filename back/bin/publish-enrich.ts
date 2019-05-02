import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import { verifyEnv } from '../src/shared/env';
import { makeLogger } from '../src/fns/logger';
import { QueueEnrichPlayArtists } from '../src/shared/queues';
import { TableUser } from '../src/shared/tables/TableUser';
import * as R from 'ramda'
const log = makeLogger({handler: 'publish-enrich', awsEvent: 'script'})

const script = async () => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DynamoEndpoint,
    QUEUE_ENRICH: process.env.QueueEnrichPlayArtists,
    TABLE_USER: process.env.TableUser,
  }, log)
  
  // const doc = new AWS.DynamoDB.DocumentClient({endpoint: env.DYNAMO_ENDPOINT, region: 'us-east-1'})

  const items = JSON.parse(fs.readFileSync(process.argv[process.argv.length-1]).toString())
  const total = items.length
  log.info(`${total} items to publish`)
  // const items = require(process.argv[process.argv.length-1])

  const tableUser = TableUser(env.DYNAMO_ENDPOINT, env.TABLE_USER, log)
  const credCache: {[k: string]: { accessToken: string, refreshToken: string, utcOffset: number}} = {}

  const uids = R.uniq<string>(items.map(i => i.uid || i.pk))
  for (const uid of uids) {
    const { valid, invalid } = await tableUser.getUser(uid)
    if (valid) {
      credCache[uid] = valid
    }
    if (invalid) {
      log.error('unable to get user credentials, will not replay', { uid })
    }
  }

  let count = 0
  for (const item of items) {
    const uid = item.pk as string
    
    const user = credCache[uid]
    if (!user) {
      log.warn('cannot add play for user without creds', { uid })
      continue
    }
    const { accessToken, refreshToken, utcOffset } = user
    
    const playedAt = item.playedAt as string
    // const track = JSON.parse(item.track)
    await QueueEnrichPlayArtists.publish(env.QUEUE_ENRICH, {
      user: {
        uid,
        accessToken,
        refreshToken,
        utcOffset,
      },
      plays: [ { played_at: playedAt, track: item.track }],
    })
    count += 1
    console.log(`published ${count}/${total}`)
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
