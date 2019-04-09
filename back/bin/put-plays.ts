import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import { verifyEnv } from '../src/shared/env';
import { slog } from '../src/fns/logger';

const log = slog.child({handler: 'put-plays', awsEvent: 'script'})

const script = async () => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DynamoEndpoint,
    TABLE_PLAY: process.env.TablePlay,
  }, log)
  
  const doc = new AWS.DynamoDB.DocumentClient({endpoint: env.DYNAMO_ENDPOINT, region: 'us-east-1'})

  const items = JSON.parse(fs.readFileSync(process.argv[process.argv.length-1]).toString())
  log.info(`${items.length} items to put`)
  // const items = require(process.argv[process.argv.length-1])

  for (const item of items) {
    await doc.put({
      TableName: env.TABLE_PLAY,
      Item: item
    }).promise()
  }

  // const r = await doc.scan({
  //   TableName: env.TABLE_PLAY
  // }).promise()

  // log.info(`${r.Items.length} items now in table`)

  // const results = await doc.scan({
  //   TableName: env.TABLE_USER,
  // }).promise()
  // log.info(`got ${results.Items.length} items back from scan`)
  // console.log(JSON.stringify(results.Items, null, 2))

}

script()
  .then(() => { process.exit() })
  .catch(err => {throw err})
