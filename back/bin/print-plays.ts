import * as AWS from 'aws-sdk';
import { verifyEnv } from '../src/shared/env';
import { slog } from '../src/fns/logger';

const log = slog.child({handler: 'print-plays', awsEvent: 'script'})

const scanAll = async (doc: AWS.DynamoDB.DocumentClient, TableName: string) => {
  let ExclusiveStartKey = null
  const collected = []
  do {
    const result = ExclusiveStartKey ?
      await doc.scan({ TableName, ExclusiveStartKey }).promise() :
      await doc.scan({ TableName }).promise()

    // result.Items.forEach(collected.push.bind(collected))
    // log.info('scanAll', {soFar: collected.length})
    const out = JSON.stringify(result.Items, null, 2)
    const trimmed = out.slice(1, out.length-1) // get rid of the wrapping []
    console.log(trimmed)
    ExclusiveStartKey = result.LastEvaluatedKey
    if (ExclusiveStartKey) {
      console.log(',')
    }
  } while (ExclusiveStartKey)
  // log.info('scanAll', {total: collected.length})
  // return collected
}

const script = async () => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DynamoEndpoint,
    TABLE_PLAY: process.env.TablePlay,
  }, log)
  
  const doc = new AWS.DynamoDB.DocumentClient({endpoint: env.DYNAMO_ENDPOINT, region: 'us-east-1'})
  console.log('[')
  await scanAll(doc, env.TABLE_PLAY)
  console.log(']')
}

script()
  .then(() => { process.exit() })
  .catch(err => {throw err})
