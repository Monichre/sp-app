import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import { verifyEnv } from '../src/shared/env';
import { makeLogger } from '../src/fns/logger';

const log = makeLogger({handler: 'put-plays', awsEvent: 'script'})

const script = async () => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DynamoEndpoint,
    TABLE_PLAY: process.env.TablePlay,
  }, log)
  
  const doc = new AWS.DynamoDB.DocumentClient({endpoint: env.DYNAMO_ENDPOINT, region: 'us-east-1'})

  const items = JSON.parse(fs.readFileSync(process.argv[process.argv.length-1]).toString())
  log.info(`${items.length} items to put`)

  for (const item of items) {
    const { track, ...Item } = item
    await doc.put({
      TableName: env.TABLE_PLAY,
      Item: {
        track: JSON.parse(track),
        ...Item
      }
    }).promise()
  }
}

script()
  .then(() => { process.exit() })
  .catch(err => {throw err})
