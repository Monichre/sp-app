import * as AWS from 'aws-sdk';
import { makeExecutableSchema } from "graphql-tools";
import { QueryResolvers, Image } from "../types";
import { TableUser } from '../../../shared/tables/TableUser';
import { QueueStartHarvestUser } from '../../../shared/queues';
import { TablePlay } from '../../../shared/tables/TablePlay';

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
  id: String!
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
  const log = context.log.child({handler: `graphql/recentPlays/${uid}`})
  log.info(`message to QueueStartHarvestUser`, {queueName: context.QUEUE_START_HARVEST_USER})
  QueueStartHarvestUser.publish(context.QUEUE_START_HARVEST_USER, {
    uid,
  })


  const tablePlay = TablePlay(context.DYNAMO_ENDPOINT, context.TABLE_PLAY)
  const { docs, errors } = await tablePlay.getRecentPlays(uid, 100)


  if (errors.length > 0) {
    log.error('errors in plays fetched from TablePlay', { errors })
  }
  log.info('from TablePlay', { count: docs.length })

  try {
    const plays = docs
    const table = TableUser(context.DYNAMO_ENDPOINT, context.TABLE_USER)
    const lastUpdate = await table.getSpotifyLastUpdate(uid)
    log.info('returning', { lastUpdate, plays })
    return {
      plays,
      lastUpdate,
    }
  } catch (error) {
    log.error('unable to format response', {error, docs})
  }
}

const resolvers = {
  Query: {
    recentPlays,
  }
}

export const schema = makeExecutableSchema({typeDefs, resolvers})