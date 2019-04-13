import { SQSHandler } from "aws-lambda";
import { verifyEnv } from "../shared/env";

import { slog } from "./logger";
import { IncomingWebhook } from '@slack/webhook'

const log = slog.child({handler: 'errorsToSlack', awsEvent: 'sqs'})

export const handler: SQSHandler = async (event, context) => {
  const env = verifyEnv({
    SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
  }, log)
  const hook = new IncomingWebhook(env.SLACK_WEBHOOK_URL)
  for (const r of event.Records) {
    hook.send({
      text: JSON.stringify(JSON.parse(r.body), null, 2) // pretty-print plskthx
    })
  }
}
