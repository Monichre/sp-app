import * as t from 'io-ts'
import * as AWS from 'aws-sdk';
import { SQSEvent } from "aws-lambda";
import { SpotifyPlay } from './SpotifyApi';
import { isRight, isLeft } from 'fp-ts/lib/Either';
import { decodeAll } from './validation';



const MessageEnrichPlayArtists = t.type({
  user: t.type({
    uid: t.string,
    accessToken: t.string,
    refreshToken: t.string,
    utcOffset: t.number,
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
    return decodeAll(MessageEnrichPlayArtists, e.Records.map(r => JSON.parse(r.body)))
  }
}

const MessageFetchSpotifyPlays = t.type({
  uid: t.string,
  accessToken: t.string,
  refreshToken: t.string,
  utcOffset: t.number,
})

export type TMessageFetchSpotifyPlays = t.TypeOf<typeof MessageFetchSpotifyPlays>

export const QueueFetchSpotifyPlays = {
  publish: async (QueueUrl: string, m: TMessageFetchSpotifyPlays) => {
    const sqs = new AWS.SQS()
    return sqs.sendMessage({
      QueueUrl,
      MessageBody: JSON.stringify(m),
    }).promise()
  },
  extract: (e: SQSEvent) => {
    return decodeAll(MessageFetchSpotifyPlays, e.Records.map(r => JSON.parse(r.body)))
  }
}

const MessageStartHarvestUser = t.type({
  uid: t.string,
})

export type TMessageStartHarvestUser = t.TypeOf<typeof MessageStartHarvestUser>

export const QueueStartHarvestUser = {
  publish: async (QueueUrl: string, m: TMessageStartHarvestUser) => {
    const sqs = new AWS.SQS()
    return sqs.sendMessage({
      QueueUrl,
      MessageBody: JSON.stringify(m),
    }).promise()
  },
  extract: (e: SQSEvent) => {
    return decodeAll(MessageStartHarvestUser, e.Records.map(r => JSON.parse(r.body)))
  }
}

const MessageValidationErrors = t.type({
  uid: t.string,
  paths: t.array(t.string),
  context: t.any,
})

export type TMessageValidationErrors = t.TypeOf<typeof MessageValidationErrors>

export const QueueValidationErrors = {
  publish: async (QueueUrl: string, m: TMessageValidationErrors) => {
    const sqs = new AWS.SQS()
    return sqs.sendMessage({
      QueueUrl,
      MessageBody: JSON.stringify(m),
    }).promise()
  },
  extract: (e: SQSEvent) => {
    const parsed = e.Records.map(r => JSON.parse(r.body))
    const decoded = parsed.map(MessageValidationErrors.decode)
    const errors = decoded.filter(isLeft).map(r => r.value)
    const messages = decoded.filter(isRight).map(r => r.value)
    return { errors, messages }
  }
}