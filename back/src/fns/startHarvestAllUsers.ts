import { ScheduledHandler, ScheduledEvent, Context, APIGatewayEvent, APIGatewayProxyResult, Handler } from "aws-lambda";
import * as AWS from 'aws-sdk';

export const handler: Handler<ScheduledEvent | APIGatewayEvent, void | APIGatewayProxyResult> = async (event, context) => {
  console.log('event', JSON.stringify(event, null, 2))

  const doc = new AWS.DynamoDB.DocumentClient({endpoint: process.env.DYNAMO_ENDPOINT})
  const results = await doc.scan({
    TableName: process.env.TABLE_SOURCE
  }).promise()
  console.log('results', results)

  const sqs = new AWS.SQS()
  for (const result of results.Items) {
    const result = await sqs.sendMessage({
      MessageBody: JSON.stringify({profileId: '1234'}),
      QueueUrl: process.env.QUEUE_TARGET,
    }).promise()  
  }
  if (event['httpMethod']) { // hacky test to see if its being called from http
    return {
      statusCode: 200,
      body: JSON.stringify({message: `${results.Items.length} users harvesting`}, null, 2)
    }  
  }

}
