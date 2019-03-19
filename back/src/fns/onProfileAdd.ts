import { DynamoDBStreamHandler } from "aws-lambda";

export const handler: DynamoDBStreamHandler = async (event, context) => {
  console.log('ddb stream listener received event:', JSON.stringify(event, null, 2))
}