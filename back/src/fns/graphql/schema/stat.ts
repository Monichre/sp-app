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

type PlaytimeSummaryPeriods {
  current: Int!
  prev: Int!
}

type PlaytimeSummaryResponse {
  day: PlaytimeSummaryPeriods!
  week: PlaytimeSummaryPeriods!
  month: PlaytimeSummaryPeriods!
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

  return {
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