import * as AWS from 'aws-sdk';
import { verifyEnv } from '../src/shared/env';
import * as fs from 'fs'

const scanAll = async (doc: AWS.DynamoDB.DocumentClient, TableName: string) => {
  let ExclusiveStartKey = null
  do {
    const result = ExclusiveStartKey ?
      await doc.scan({ TableName, ExclusiveStartKey }).promise() :
      await doc.scan({ TableName }).promise()
    
    const out = JSON.stringify(result.Items, null, 2)
    const trimmed = out.slice(1, out.length-1) // get rid of the wrapping []
    console.log(trimmed)
    const writer = fs.createWriteStream('achievements.txt')
    writer.write(JSON.stringify(trimmed))
    
    ExclusiveStartKey = result.LastEvaluatedKey
    if (ExclusiveStartKey) {
      console.log(',')
    }
  } while (ExclusiveStartKey)
}

const script = async () => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DynamoEndpoint,
    TABLE: process.env.TABLE,
    TARGET: process.env.TARGET,
  })
  
  const doc = new AWS.DynamoDB.DocumentClient({endpoint: env.DYNAMO_ENDPOINT, region: 'us-east-1'})
  const TableName = `sp-app-back-${env.TARGET}-${env.TABLE}`
  console.log('[')
  await scanAll(doc, TableName)
  console.log(']')
}

script()
  .then(() => { process.exit() })
  .catch(err => {throw err})
