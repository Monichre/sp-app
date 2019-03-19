import * as AWS from 'aws-sdk';
import { Handler, APIGatewayEvent } from "aws-lambda";
import { config } from './config';
import * as uuid from 'uuid/v1'

export const handler: Handler<APIGatewayEvent> = async (event, context) => {
  console.log('function', JSON.stringify(context.invokedFunctionArn, null, 2))
  console.log('requestContext.authorizer', event.requestContext.authorizer)
  console.log('requestContext.identity', event.requestContext.identity)
  console.log('env.TABLE_TARGET', process.env.TABLE_TARGET)

  const params = await config()
  console.log('params', params)
  const args = JSON.parse(event.body)
  console.log('args', args)

  // const dyn = new AWS.DynamoDB({endpoint: process.env.TABLE_TARGET})

  const doc = new AWS.DynamoDB.DocumentClient({endpoint: process.env.DYNAMO_ENDPOINT})
  const result = await doc.put({
    TableName: process.env.TABLE_TARGET,
    Item: {
      "pk": uuid(),
      "sk": "detail",
      "email": args.email || 'test@test.com',
      "createdAt": "timestamp",
    }
  }).promise()
  // const result = await dyn.putItem({
  //   // TableName: "TableProfile",
  //   TableUrl: "",
  //   Item: {
  //     "pk": {
  //       S: "user:1234"
  //     },
  //     "sk": {
  //       S: "detail"
  //     },
  //     "email": {
  //       S: "foo@bar.com"
  //     },
  //     "createdAt": {
  //       S: "timestamp"
  //     }
  //   }
  // }, () => {}).promise()

  const body = JSON.stringify({
    result,
    identity: event.requestContext.identity
  })

  return {
    statusCode: '200',
    // body: JSON.stringify(result)
    body,
  }
}
