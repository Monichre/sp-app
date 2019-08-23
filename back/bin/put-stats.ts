import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import { verifyEnv } from '../src/shared/env';
import { makeLogger } from '../src/fns/logger';

const log = makeLogger({handler: 'put-stats', awsEvent: 'script'})

const script = async () => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DynamoEndpoint,
    TABLE_STAT: process.env.TableStat,
  }, log)
  
  const doc = new AWS.DynamoDB.DocumentClient({endpoint: env.DYNAMO_ENDPOINT, region: 'us-east-1'})

  const items = JSON.parse(fs.readFileSync(process.argv[process.argv.length-1]).toString())
  log.info(`${items.length} items to put`)

  for (const item of items) {
    await doc.put({
      TableName: env.TABLE_STAT,
      Item: item
    }).promise()
  }
}

script()
  .then(() => { process.exit() })
  .catch(err => {throw err})
