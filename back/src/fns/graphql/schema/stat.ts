import * as AWS from 'aws-sdk';
import * as R from 'ramda';
import { makeExecutableSchema } from "graphql-tools";
import { QueryResolvers } from "../types";
import { verifyEnv } from '../../../shared/env';
import moment = require('moment');

const typeDefs = `
type Query {
  playtimeSummary(uid: String!): PlaytimeSummaryResponse!
  dashStats(uid: String!): DashStatsResponse!
}
type Mutation {
  _: String
}

type PlaytimeSummaryPeriods {
  current: Float!
  prev: Float!
}

type PlaytimeSummaryResponse {
  topLifetimeArtists: [ArtistPlaytime!]!
  day: PlaytimeSummaryPeriods!
  week: PlaytimeSummaryPeriods!
  month: PlaytimeSummaryPeriods!
}

type Image {
  url: String!
}
type SpotifyUrl {
  spotify: String!
}

type Artist {
  name: String!
  images: [Image!]!
  external_urls: SpotifyUrl!
  genres: [String!]!
}

type ArtistPlaytime {
  artist: Artist!
  playDurationMs: Float!
}

type PeriodGlobalUserArtistPlaytimes {
  global: [ArtistPlaytime!]!
  user: [ArtistPlaytime!]!
}

type UserArtistPlaytimes {
  week: PeriodGlobalUserArtistPlaytimes!
  month: PeriodGlobalUserArtistPlaytimes!
  life: PeriodGlobalUserArtistPlaytimes!
}

type GenrePlaytime {
  name: String!
  playDurationMs: Float!
}

type UserGenrePeriodPlaytimes {
  global: [GenrePlaytime!]!
  user: [GenrePlaytime!]!
}

type UserGenrePlaytimes {
  week: UserGenrePeriodPlaytimes!
  month: UserGenrePeriodPlaytimes!
  life: UserGenrePeriodPlaytimes!
}

type DashStatsResponse {
  topArtists: UserArtistPlaytimes!
  topGenres: UserGenrePlaytimes!
}

`
type StatKeys = {
  uid: string,
  periodType: string,
  periodValue: string,
}

const getStat = async (doc: AWS.DynamoDB.DocumentClient, TableName: string, {uid, periodType, periodValue}: StatKeys) => {
  return await doc.get({
    TableName,
    Key: {
      pk: [uid, 'total', periodType, periodValue].join('#'),
      sk: [uid, periodType, 'total'].join('#'),
    }
  }).promise().then(r => r.Item && r.Item.playDurationMs || 0)
}

const playtimeSummary: QueryResolvers.PlaytimeSummaryResolver = async (_, {uid}, context) => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    TABLE_STAT: process.env.TABLE_STAT,
  })

  // this should all be:
  // const { day, month } = table.periodsFor((new Date()).toISOString())
  // const today = await table.getUserStat(uid, 'total', 'day', day)
  // const thisMonth = await table.getUserStat(uid, 'total', 'month', month)
  const doc = new AWS.DynamoDB.DocumentClient({endpoint: env.DYNAMO_ENDPOINT})
  const TableName = env.TABLE_STAT

  const m = moment()
  const day = m.format('YYYY-MM-DD')
  const yest = m.clone().subtract(1, 'days').format('YYYY-MM-DD')
  const week = m.format('YYYY-WW')
  const lastweek = m.clone().subtract(1, 'weeks').format('YYYY-WW')
  const month = m.format('YYYY-MM')
  const lastMonth = m.clone().subtract(1, 'months').format('YYYY-MM')

  const topLifetimeArtists = await topArtistsFor(doc, TableName, uid, 'life', 'life', 1)
  return {
    topLifetimeArtists,
    day: {
      current: await getStat(doc, TableName, {uid, periodType: 'day', periodValue: day}),
      prev: await getStat(doc, TableName, {uid, periodType: 'day', periodValue: yest}),
    },
    week: {
      current: await getStat(doc, TableName, {uid, periodType: 'week', periodValue: week}),
      prev: await getStat(doc, TableName, {uid, periodType: 'week', periodValue: lastweek}),
    },
    month: {
      current: await getStat(doc, TableName, {uid, periodType: 'month', periodValue: month}),
      prev: await getStat(doc, TableName, {uid, periodType: 'month', periodValue: lastMonth}),
    },
  }

  // const today = await doc.get({
  //   TableName,
  //   Key: {
  //     pk: [uid, 'total', 'day', day].join('#'),
  //     sk: [uid, 'day', 'total'].join('#'),
  //   }
  // }).promise()
  // const thisMonth = await doc.get({
  //   TableName,
  //   Key: {
  //     pk: [uid, 'total', 'month', month].join('#'),
  //     sk: [uid, 'month', 'total'].join('#'),
  //   }
  // }).promise()
  // return {
  //   today: today.Item.playDurationMs,
  //   thisMonth: thisMonth.Item.playDurationMs,
  // }
}
type StatRow = {
  name: string,
  playDurationMs: number,
}

const byTimeThenName = R.sortWith<StatRow>([
  R.descend(R.prop('playDurationMs')),
  R.ascend(R.prop('name'))
])

const topArtistsFor = async (doc, TableName, uid: string, periodName, periodValue, Limit = 5) => {
  const params = {
    TableName,
    Limit,
    KeyConditionExpression: `pk = :pk`,
    IndexName: 'LSIPlayDuration',
    ScanIndexForward: false,
    ExpressionAttributeValues: {
      ':pk': [uid, 'artist', periodName, periodValue].join('#')
    }
  }
  return await doc.query(params).promise()
    .then(d => d.Items.map(i => ({artist: i.artist, playDurationMs: i.playDurationMs})))
    .then(byTimeThenName)
}

const topGenresFor = async (doc, TableName, uid: string, periodName, periodValue, Limit = 5) => {
  const params = {
    TableName,
    Limit,
    KeyConditionExpression: `pk = :pk`,
    IndexName: 'LSIPlayDuration',
    ScanIndexForward: false,
    ExpressionAttributeValues: {
      ':pk': [uid, 'genre', periodName, periodValue].join('#')
    }
  }
  return await doc.query(params).promise()
    .then(d => d.Items.map(i => ({name: i.genre, playDurationMs: i.playDurationMs})))
    .then(byTimeThenName)
}

// const dashStats = async (_, {uid}, context) => {
const dashStats: QueryResolvers.DashStatsResolver = async (_, {uid}, context) => {
  const doc = new AWS.DynamoDB.DocumentClient({endpoint: context.DYNAMO_ENDPOINT})
  const TableName = context.TABLE_STAT

  const m = moment()
  const day = m.format('YYYY-MM-DD')
  const week = m.format('YYYY-WW')
  const month = m.format('YYYY-MM')

  const result = {
    topArtists: {
      week: {
        global: await topArtistsFor(doc, TableName, 'global', 'week', week),
        user: await topArtistsFor(doc, TableName, uid, 'week', week),
      },
      month: {
        global: await topArtistsFor(doc, TableName, 'global', 'month', month),
        user: await topArtistsFor(doc, TableName, uid, 'month', month),
      },
      life: {
        global: await topArtistsFor(doc, TableName, 'global', 'life', 'life'),
        user: await topArtistsFor(doc, TableName, uid, 'life', 'life'),
      }
    },
    topGenres: {
      week: {
        global: await topGenresFor(doc, TableName, 'global', 'week', week),
        user: await topGenresFor(doc, TableName, uid, 'week', week),
      },
      month: {
        global: await topGenresFor(doc, TableName, 'global', 'month', month),
        user: await topGenresFor(doc, TableName, uid, 'month', month),
      },
      life: {
        global: await topGenresFor(doc, TableName, 'global', 'life', 'life'),
        user: await topGenresFor(doc, TableName, uid, 'life', 'life'),
      }
    }
  }
  return result
}

const resolvers = {
  Query: {
    playtimeSummary,
    dashStats,
  }
}

export const schema = makeExecutableSchema({typeDefs, resolvers})