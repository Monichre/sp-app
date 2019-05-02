import * as AWS from 'aws-sdk';
import { verifyEnv } from '../src/shared/env';
import { makeLogger } from '../src/fns/logger';

const log = makeLogger({handler: 'empty-ddb-plays', awsEvent: 'script'})

const emptyTable = async (doc: AWS.DynamoDB.DocumentClient, TableName: string) => {
  let itemsRemaining = 0
  do {
    const result = await doc.scan({ TableName }).promise()
    itemsRemaining = result.Items.length
    log.info('emptyTable', { TableName, itemsRemaining })
    await Promise.all(result.Items.map(({pk, sk}) => doc.delete({TableName, Key: { pk, sk }}).promise()))
  } while (itemsRemaining > 0)
}

const script = async () => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DynamoEndpoint,
    TABLE_PLAY: process.env.TablePlay,
    TABLE_STAT: process.env.TableStat,
  }, log)
  
  const doc = new AWS.DynamoDB.DocumentClient({endpoint: env.DYNAMO_ENDPOINT, region: 'us-east-1'})
  await emptyTable(doc, env.TABLE_PLAY)
  await emptyTable(doc, env.TABLE_STAT)
}

script()
  .then(() => { process.exit() })
  .catch(err => {throw err})
