import * as AWS from 'aws-sdk';
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

type PlaytimeSummaryResponse {
  today: Int!
  thisMonth: Int!
}

type ArtistPlaytime {
  name: String!
  playDurationMs: Int!
}

type PeriodGlobalUserArtistPlaytimes {
  global: [ArtistPlaytime!]!
  user: [ArtistPlaytime!]!
}

type DashStatsResponse {
  week: PeriodGlobalUserArtistPlaytimes!
  month: PeriodGlobalUserArtistPlaytimes!
  life: PeriodGlobalUserArtistPlaytimes!
}

`

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
  const month = m.format('YYYY-MM')

  const today = await doc.get({
    TableName,
    Key: {
      pk: [uid, 'total', 'day', day].join('#'),
      sk: [uid, 'day', 'total'].join('#'),
    }
  }).promise()
  const thisMonth = await doc.get({
    TableName,
    Key: {
      pk: [uid, 'total', 'month', month].join('#'),
      sk: [uid, 'month', 'total'].join('#'),
    }
  }).promise()
  return {
    today: today.Item.playDurationMs,
    thisMonth: thisMonth.Item.playDurationMs,
  }
}

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
    .then(d => d.Items.map(i => ({name: i.artist.name, playDurationMs: i.playDurationMs})))
}

const dashStats: QueryResolvers.DashStatsResolver = async (_, {uid}, context) => {
  console.log('dashStats')
  const doc = new AWS.DynamoDB.DocumentClient({endpoint: context.DYNAMO_ENDPOINT})
  const TableName = context.TABLE_STAT

  const m = moment()
  const day = m.format('YYYY-MM-DD')
  const week = m.format('YYYY-WW')
  const month = m.format('YYYY-MM')

  return {
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
  }
}

const resolvers = {
  Query: {
    playtimeSummary,
    dashStats,
  }
}

export const schema = makeExecutableSchema({typeDefs, resolvers})