import { Handler, APIGatewayEvent } from "aws-lambda";
import * as AWS from 'aws-sdk';

export const handler: Handler<APIGatewayEvent> = async (event, context) => {
  console.log('target ns', process.env.NS)
  console.log('function', JSON.stringify(context.invokedFunctionArn, null, 2))
  console.log('env', JSON.stringify(process.env.QUEUE_TARGET, null, 2))

  const sqs = new AWS.SQS()
  const result = await sqs.sendMessage({
    MessageBody: JSON.stringify({profileId: '1234'}),
    QueueUrl: process.env.QUEUE_TARGET,
  }).promise()

  return {
    statusCode: "200",
    body: JSON.stringify(result, null, 2)
  }
}
