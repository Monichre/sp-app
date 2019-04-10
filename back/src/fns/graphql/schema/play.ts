import * as AWS from 'aws-sdk';
import { makeExecutableSchema } from "graphql-tools";
import { QueryResolvers, Image } from "../types";
import { TableUser } from '../../../shared/tables/TableUser';
import { QueueStartHarvestUser } from '../../../shared/queues';

const typeDefs = `
type Query {
  recentPlays(uid: String!): RecentPlaysResponse!
}
type Mutation {
  _: String
}

type RecentPlaysResponse {
  lastUpdate: String
  plays: [Play!]!
}

type Play {
  track: Track!
  playedAt: String!
}

type Track {
  name: String!
  artists: [Artist!]!
  album: Album!
}

type Artist {
  name: String!
  images: [Image!]!
  external_urls: SpotifyUrl!
  genres: [String!]!
}

type Album {
  name: String!
  images: [Image]!
}

type Image {
  url: String!
}

type SpotifyUrl {
  spotify: String!
}
`

const recentPlays: QueryResolvers.RecentPlaysResolver = async (_, {uid}, context) => {
  // so this is a terrible thing to do: push a fetch task every time the query is run
  // design notes:
  // - doing it this way wouldnt be as bad if we checked lastUpdate to make sure the data was really stale
  // - even better might be a heartbeat mutation (along with staleness check) to better regulate frequency?
  context.log.info(`publishing to queue ${context.QUEUE_START_HARVEST_USER}`)
  QueueStartHarvestUser.publish(context.QUEUE_START_HARVEST_USER, {
    uid,
  })


  const doc = new AWS.DynamoDB.DocumentClient({endpoint: context.DYNAMO_ENDPOINT})

  const TableName = context.TABLE_PLAY
  context.log.info('reading from ', {TableName})
  
  const results = await doc.query({
    TableName,
    KeyConditionExpression: 'pk = :p and begins_with(sk, :s)',
    ScanIndexForward: false,
    ExpressionAttributeValues: {
      ':p': uid,
      ':s': `track#`
    },
    Limit: 100,
  }).promise()
  const plays = results.Items.map(i => {
    const { name, artists, album }: { name: string, artists: any[], album: any } = JSON.parse(i.track)
    return {
      playedAt: i.playedAt,
      track: {
        name,
        artists: (artists as any[]).map(a => ({
          name: a.name as string,
          images: a.images as Image[],
          genres: a.genres as string[],
          external_urls: a.external_urls as {spotify: string}
        })),
        album,
      }
    }
  })
  const table = TableUser(context.DYNAMO_ENDPOINT, context.TABLE_USER)
  const lastUpdate = await table.getSpotifyLastUpdate(uid)
  return {
    plays,
    lastUpdate,
  }
}

const resolvers = {
  Query: {
    recentPlays,
  }
}

export const schema = makeExecutableSchema({typeDefs, resolvers})