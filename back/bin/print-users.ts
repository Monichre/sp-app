import * as AWS from 'aws-sdk';
import { verifyEnv } from '../src/shared/env';
import { slog } from '../src/fns/logger';

const log = slog.child({handler: 'print-users', awsEvent: 'script'})

const script = async () => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DynamoEndpoint,
    TABLE_USER: process.env.TableUser,
  }, log)
  
  const doc = new AWS.DynamoDB.DocumentClient({endpoint: env.DYNAMO_ENDPOINT, region: 'us-east-1'})
  const results = await doc.scan({
    TableName: env.TABLE_USER,
  }).promise()
  log.info(`got ${results.Items.length} items back from scan`)
  console.log(JSON.stringify(results.Items, null, 2))

}

script()
  .then(() => { process.exit() })
  .catch(err => {throw err})
