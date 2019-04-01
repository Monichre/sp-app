import { DynamoDBStreamHandler } from "aws-lambda";
import { slog } from "./logger";

// not used atm

const log = slog.child({handler: 'onProfileAdd', awsEvent: 'ddbs'})

// not used atm

export const handler: DynamoDBStreamHandler = async (event, context) => {
  // console.log('ddb stream listener received event:', JSON.stringify(event, null, 2))
  log.info('ddb stream listener received event!')
}