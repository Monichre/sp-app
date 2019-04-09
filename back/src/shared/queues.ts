import * as t from 'io-ts'
import * as AWS from 'aws-sdk';
import { SQSEvent } from "aws-lambda";
import { SpotifyTrackVerbose, SpotifyTrack, SpotifyPlay } from './SpotifyApi';
import { Message } from 'protobufjs';
import { isRight, isLeft } from 'fp-ts/lib/Either';



const MessageEnrichPlayArtists = t.type({
  user: t.type({
    uid: t.string,
    accessToken: t.string,
    refreshToken: t.string,
  }),
  plays: t.array(SpotifyPlay)
})
export type TMessageEnrichPlayArtists = t.TypeOf<typeof MessageEnrichPlayArtists>

export const QueueEnrichPlayArtists = {
  publish: async (QueueUrl: string, m: TMessageEnrichPlayArtists) => {
    const sqs = new AWS.SQS()
    return sqs.sendMessage({
      QueueUrl,
      MessageBody: JSON.stringify(m),
    }).promise()  
  },
  extract: (e: SQSEvent) => {
    const records = e.Records.map(r => JSON.parse(r.body)).map(MessageEnrichPlayArtists.decode)
    const messages = records.filter(isRight).map(r => r.value)
    const errors = records.filter(isLeft).map(r => r.value)
    return {errors, messages}
  }
}


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