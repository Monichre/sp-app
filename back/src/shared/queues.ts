import * as AWS from 'aws-sdk';
import { SQSEvent } from "aws-lambda";

type QueueFetchSpotifyPlaysMessage = {
  uid: string,
  accessToken: string,
  refreshToken: string,
}

export const QueueFetchSpotifyPlays = {
  publish: async (QueueUrl: string, m: QueueFetchSpotifyPlaysMessage) => {
    const sqs = new AWS.SQS()
    return sqs.sendMessage({
      QueueUrl,
      MessageBody: JSON.stringify(m),
    }).promise()
  },
  extract: (e: SQSEvent) => {
    const messages = e.Records.map(r => JSON.parse(r.body))
    // do something to validate this shit
    return messages as QueueFetchSpotifyPlaysMessage[]
  }
}

type QueueStartHarvestUserMessage = {
  uid: string
}

export const QueueStartHarvestUser = {
  publish: async (QueueUrl: string, m: QueueStartHarvestUserMessage) => {
    const sqs = new AWS.SQS()
    return sqs.sendMessage({
      QueueUrl,
      MessageBody: JSON.stringify(m),
    }).promise()
  },
  extract: (e: SQSEvent) => {
    const messages = e.Records.map(r => JSON.parse(r.body))
    // do something to validate this shit
    return messages as QueueStartHarvestUserMessage[]
  }
}