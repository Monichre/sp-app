import * as AWS from 'aws-sdk';
import { verifyEnv } from '../src/shared/env';
import { makeLogger } from '../src/fns/logger';

const log = makeLogger({handler: 'print-plays', awsEvent: 'script'})

const scanAll = async (doc: AWS.DynamoDB.DocumentClient, TableName: string) => {
  let ExclusiveStartKey = null
  let count = 0
  do {
    const result = ExclusiveStartKey ?
      await doc.scan({ TableName, ExclusiveStartKey }).promise() :
      await doc.scan({ TableName }).promise()

    count += result.Items.length
    // result.Items.forEach(collected.push.bind(collected))
    // log.info('scanAll', {soFar: collected.length})
    // const out = JSON.stringify(result.Items, null, 2)
    // const trimmed = out.slice(1, out.length-1) // get rid of the wrapping []
    // console.log(trimmed)
    ExclusiveStartKey = result.LastEvaluatedKey
    // if (ExclusiveStartKey) {
    //   console.log(',')
    // }
  } while (ExclusiveStartKey)
  // log.info('scanAll', {total: collected.length})
  // return collected
  return count
}

const script = async () => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DynamoEndpoint,
    TABLE_PLAY: process.env.TablePlay,
  }, log)
  
  const doc = new AWS.DynamoDB.DocumentClient({endpoint: env.DYNAMO_ENDPOINT, region: 'us-east-1'})
  // console.log('[')
  const count = await scanAll(doc, env.TABLE_PLAY)
  log.info('TablePlay total rows', { count })
}

script()
  .then(() => { process.exit() })
  .catch(err => {throw err})
