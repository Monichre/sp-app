import * as AWS from 'aws-sdk';
import { verifyEnv } from '../src/shared/env';
import { slog } from '../src/fns/logger';

const log = slog.child({handler: 'empty-ddb-plays', awsEvent: 'script'})

const script = async () => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DynamoEndpoint,
    TABLE_PLAY: process.env.TablePlay,
    TABLE_STAT: process.env.TableStat,
  }, log)
  
  const doc = new AWS.DynamoDB.DocumentClient({endpoint: env.DYNAMO_ENDPOINT, region: 'us-east-1'})
  const results = await doc.scan({
    TableName: env.TABLE_PLAY,
  }).promise()
  log.info(`got ${results.Items.length} items back from scan`)
  for (const result of results.Items) {
    log.info('item to delete', { pk: result.pk, sk: result.sk })
    await doc.delete({
      TableName: env.TABLE_PLAY,
      Key: {
        pk: result.pk,
        sk: result.sk,
      }
    }).promise()
  }

  const r3 = await doc.scan({
    TableName: env.TABLE_STAT,
  }).promise()
  for (const r of r3.Items) {
    log.info('stat to delete', { pk: r.pk, sk: r.sk })
    await doc.delete({
      TableName: env.TABLE_STAT,
      Key: {
        pk: r.pk,
        sk: r.sk,
      }
    }).promise()
  }

  const r2 = await doc.scan({
    TableName: env.TABLE_PLAY,
  }).promise()
  log.info(`${r2.Items.length} rows left`)
}

script()
  .then(() => { console.log('deleted'); process.exit() })
  .catch(err => {throw err})
