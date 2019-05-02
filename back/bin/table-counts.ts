import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import { verifyEnv } from '../src/shared/env';
import { makeLogger } from '../src/fns/logger';
import { QueueEnrichPlayArtists } from '../src/shared/queues';
import { TableUser } from '../src/shared/tables/TableUser';

const log = makeLogger({handler: 'publish-enrich', awsEvent: 'script'})

const script = async () => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DynamoEndpoint,
    TABLE_USER: process.env.TableUser,
    TABLE_PLAY: process.env.TablePlay,
    TABLE_STAT: process.env.TableStat,
  }, log)
  
  const doc = new AWS.DynamoDB.DocumentClient({endpoint: env.DYNAMO_ENDPOINT, region: 'us-east-1'})
  const ddb = new AWS.DynamoDB({endpoint: env.DYNAMO_ENDPOINT, region: 'us-east-1'})
  const tableUser = await ddb.describeTable({ TableName: env.TABLE_USER }).promise()
  const tablePlay = await ddb.describeTable({ TableName: env.TABLE_PLAY }).promise()
  const tableStat = await ddb.describeTable({ TableName: env.TABLE_STAT }).promise()

  log.info('TableUser', { count: tableUser.Table.ItemCount })
  log.info('TablePlay', { count: tablePlay.Table.ItemCount })
  log.info('TableStat', { count: tableStat.Table.ItemCount })
  // const items = JSON.parse(fs.readFileSync(process.argv[process.argv.length-1]).toString())
  // log.info(`${items.length} items to publish`)
  // // const items = require(process.argv[process.argv.length-1])

  // // const tableUser = TableUser(env.DYNAMO_ENDPOINT, env.TABLE_USER, log)
  // const credCache: {[k: string]: { accessToken: string, refreshToken: string}} = {}

  // for (const item of items) {
  //   const uid = item.pk as string
    
  //   const { accessToken, refreshToken } = credCache[uid] ?
  //     credCache[uid] :
  //     credCache[uid] = await tableUser.getSpotifyCreds(uid)

  //   const playedAt = item.playedAt as string
  //   const track = JSON.parse(item.track)
  //   QueueEnrichPlayArtists.publish(env.QUEUE_ENRICH, {
  //     user: {
  //       uid,
  //       accessToken,
  //       refreshToken,
  //     },
  //     plays: [ { played_at: playedAt, track }],
  //   })
  // }
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
