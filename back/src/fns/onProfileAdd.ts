import { DynamoDBStreamHandler } from "aws-lambda";

// not used atm

export const handler: DynamoDBStreamHandler = async (event, context) => {
  // console.log('ddb stream listener received event:', JSON.stringify(event, null, 2))
  console.log('ddb stream listener received event!')
}