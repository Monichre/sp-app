import * as AWS from 'aws-sdk';
import * as R from 'ramda';
import { makeExecutableSchema } from "graphql-tools";
import { QueryResolvers, DashStatsResponse, ArtistStatsResponse, ArtistStatsPeriod, ArtistStatsPeriodUser, Artist } from "../types";
import { verifyEnv } from '../../../shared/env';
import moment = require('moment');
import { TableUser } from '../../../shared/tables/TableUser';
import { TableStat } from '../../../shared/tables/TableStat';
import { localizeDatestring } from '../../demeter/enrichPlayArtists';

const typeDefs = `
type Query {
  playtimeSummary(uid: String!): PlaytimeSummaryResponse!
  dashStats(uid: String!): DashStatsResponse!
  artistStats(uid: String!, id: String!): ArtistStatsResponse!
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
  id: String!
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

type ArtistStatsPeriodUser {
  period: String!
  playDurationMs: Float!
}

type ArtistStatsPeriod {
  global: [ArtistStatsPeriodUser!]!
  personal: [ArtistStatsPeriodUser!]!
}

type ArtistStatsResponse {
  artist: Artist!
  past30d: ArtistStatsPeriod!
  past12w: ArtistStatsPeriod!
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
  const log = context.log.child({handler: `graphql/playtimeSummary/${uid}`})
  log.info('called by', { uid })
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    TABLE_STAT: process.env.TABLE_STAT,
  }, log)

  // this should all be:
  // const { day, month } = table.periodsFor((new Date()).toISOString())
  // const today = await table.getUserStat(uid, 'total', 'day', day)
  // const thisMonth = await table.getUserStat(uid, 'total', 'month', month)
  const doc = new AWS.DynamoDB.DocumentClient({endpoint: env.DYNAMO_ENDPOINT})
  const TableName = env.TABLE_STAT

  const tableUser = TableUser(context.DYNAMO_ENDPOINT, context.TABLE_USER)
  const { valid, invalid } = await tableUser.getUser(uid)
  if (invalid) { throw new Error(`user info invalid for uid ${uid}`) }
  const { utcOffset } = valid

  const tableStat = TableStat(context.DYNAMO_ENDPOINT, context.TABLE_STAT)
  const { day, week, month } = tableStat.periodsFor(localizeDatestring(utcOffset)(moment().toISOString(true)))
  const { day: yest } = tableStat.periodsFor(localizeDatestring(utcOffset)(moment().subtract(1, 'days').toISOString(true)))
  const { week: lastWeek } = tableStat.periodsFor(localizeDatestring(utcOffset)(moment().subtract(1, 'weeks').toISOString(true)))
  const { month: lastMonth } = tableStat.periodsFor(localizeDatestring(utcOffset)(moment().subtract(1, 'months').toISOString(true)))

  // , week: lastWeek, month: lastMonth
  // const m = moment()
  // const day = m.format('YYYY-MM-DD')
  // const yest = m.clone().subtract(1, 'days').format('YYYY-MM-DD')
  // const week = m.format('YYYY-WW')
  // const lastweek = m.clone().subtract(1, 'weeks').format('YYYY-WW')
  // const month = m.format('YYYY-MM')
  // const lastMonth = m.clone().subtract(1, 'months').format('YYYY-MM')

  const topLifetimeArtists = await topArtistsFor(doc, TableName, uid, 'life', 'life', 1)
  const response = {
    topLifetimeArtists,
    day: {
      current: await getStat(doc, TableName, {uid, periodType: 'day', periodValue: day}),
      prev: await getStat(doc, TableName, {uid, periodType: 'day', periodValue: yest}),
    },
    week: {
      current: await getStat(doc, TableName, {uid, periodType: 'week', periodValue: week}),
      prev: await getStat(doc, TableName, {uid, periodType: 'week', periodValue: lastWeek}),
    },
    month: {
      current: await getStat(doc, TableName, {uid, periodType: 'month', periodValue: month}),
      prev: await getStat(doc, TableName, {uid, periodType: 'month', periodValue: lastMonth}),
    },
  }
  log.info('completed')
  return response
}
type TopGenresRow = {
  name: string,
  playDurationMs: number,
}

type TopArtistsRow = {
  artist: Artist,
  playDurationMs: number,
}

type ArtistPeriodsRow = {
  period: string,
  playDurationMs: number,
}

const byTimeThenGenreName = R.sortWith<TopGenresRow>([
  R.descend(R.prop('playDurationMs')),
  R.ascend(R.prop('name'))
])

const byTimeThenArtistName = R.sortWith<TopArtistsRow>([
  R.descend(R.prop('playDurationMs')),
  R.ascend(R.path(['artist', 'name']))
])

const byPeriod = R.sortWith<ArtistPeriodsRow>([
  R.ascend(R.path(['period']))
])
const topArtistsFor = async (doc: AWS.DynamoDB.DocumentClient, TableName, uid: string, periodName, periodValue, Limit = 5) => {
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
    .then(byTimeThenArtistName)
}

const topGenresFor = async (doc: AWS.DynamoDB.DocumentClient, TableName, uid: string, periodName, periodValue, Limit = 5) => {
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
    .then(byTimeThenGenreName)
}

// const dashStats = async (_, {uid}, context) => {
const dashStats: QueryResolvers.DashStatsResolver = async (_, {uid}, context) => {
  const doc = new AWS.DynamoDB.DocumentClient({endpoint: context.DYNAMO_ENDPOINT})
  const TableName = context.TABLE_STAT

  const tableStat = TableStat(context.DYNAMO_ENDPOINT, context.TABLE_STAT)

  const tableUser = TableUser(context.DYNAMO_ENDPOINT, context.TABLE_USER)
  const { valid, invalid } = await tableUser.getUser(uid)
  if (invalid) { throw new Error(`user info invalid for uid ${uid}`) }
  const { utcOffset } = valid

  const { week, month } = tableStat.periodsFor(localizeDatestring(utcOffset)(moment().toISOString(true)))
  // const m = moment()
  // const week = m.format('YYYY-WW')
  // const month = m.format('YYYY-MM')

  const result: DashStatsResponse = {
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
        global: await topGenresFor(doc, TableName, 'global', 'week', week, 10),
        user: await topGenresFor(doc, TableName, uid, 'week', week, 10),
      },
      month: {
        global: await topGenresFor(doc, TableName, 'global', 'month', month, 10),
        user: await topGenresFor(doc, TableName, uid, 'month', month, 10),
      },
      life: {
        global: await topGenresFor(doc, TableName, 'global', 'life', 'life', 10),
        user: await topGenresFor(doc, TableName, uid, 'life', 'life', 10),
      }
    }
  }
  return result
}

const artistStatsLife = async (doc: AWS.DynamoDB.DocumentClient, TableName, uid: string, id: string) => {
  const pk = [uid, 'artist', 'life', 'life'].join('#')
  const sk = [uid, 'life', id].join('#')
  const params = {
    TableName,
    Key: {
      pk,
      sk,
    },
  }
  // console.log('artistStatsLife params', params)
  const result = await doc.get(params).promise()
    .then(d => d.Item)
    .then(i => ({
      artist: i.artist,
      playDurationMs: i.playDurationMs,
    }))
  return result
}

const artistStatsFor = async (doc: AWS.DynamoDB.DocumentClient, TableName, uid: string, id: string, periodType: string, startPeriod: string, endPeriod: string) => {
  const sk = [uid, periodType, id].join('#')
  const startPk = [uid, 'artist', periodType, startPeriod].join('#')
  const endPk = [uid, 'artist', periodType, endPeriod].join('#')
  // console.log('getting stats for', { sk, startPk, endPk })

  const params = {
    TableName,
    // Limit,
    KeyConditionExpression: `sk = :sk and pk BETWEEN :s and :e`,
    IndexName: 'GSIReverse',
    // ScanIndexForward: false,
    ExpressionAttributeValues: {
      ':sk': sk,
      ':s': startPk,
      ':e': endPk
    }
  }
  const result = await doc.query(params).promise()
    .then(d => d.Items.map(i => ({
      artist: i.artist,
      period: i.pk.split('#')[3],
      playDurationMs: i.playDurationMs
    })))
    .then(byPeriod)
  // console.log('artistStatsFor', uid, id, result)
  return result
}

const fill = (length: number) => Array.apply(null, { length }).map(Number.call, Number)

const fillDays = (stats: ArtistStatsPeriodUser[]) => {
  const periods = fill(30).map((_, i) => moment().subtract(i, 'days').format('YYYY-MM-DD'))
  const filledStats = periods.map(period => ({
    period,
    playDurationMs: stats.find(s => s.period == period) ? stats.find(s => s.period == period).playDurationMs : 0
  }))
  // console.log('fillDays filledStats', filledStats)
  return filledStats
}

const fillWeeks = (stats: ArtistStatsPeriodUser[]) => {
  const periods = fill(12).map((_, i) => moment().subtract(i, 'weeks').format('YYYY-WW'))
  return periods.map(period => ({
    period,
    playDurationMs: stats.find(s => s.period == period) ? stats.find(s => s.period == period).playDurationMs : 0
  }))
}

const artistStats: QueryResolvers.ArtistStatsResolver = async (_, {uid, id}, context) => {
  const log = context.log.child({handler: `graphql/artistStats/${uid}/${id}`})
  log.info('called by', { uid, artistId: id })
  const doc = new AWS.DynamoDB.DocumentClient({endpoint: context.DYNAMO_ENDPOINT})
  const TableName = context.TABLE_STAT

  const m = moment()
  const day = m.format('YYYY-MM-DD')
  const week = m.format('YYYY-WW')

  const m30d = moment().subtract(30, 'days')
  const m30dDay = m30d.format('YYYY-MM-DD')

  const m12w = moment().subtract(12, 'weeks')
  const m12wWeek = m12w.format('YYYY-WW')

  const lifeStats = await artistStatsLife(doc, TableName, 'global', id)
  log.info('artistStatsFor', {TableName, uid, id, day, m30dDay, week, m12wWeek})
  const past30d = {
    global: byPeriod(fillDays(await artistStatsFor(doc, TableName, 'global', id, 'day', m30dDay, day))),
    personal: byPeriod(fillDays(await artistStatsFor(doc, TableName, uid, id, 'day', m30dDay, day))),
  }
  const past12w = {
    global: byPeriod(fillWeeks(await artistStatsFor(doc, TableName, 'global', id, 'week', m12wWeek, week))),
    personal: byPeriod(fillWeeks(await artistStatsFor(doc, TableName, uid, id, 'week', m12wWeek, week))),
  }
  // log.info('returning', { past30d, past12w })
  const artist = lifeStats.artist
  const response: ArtistStatsResponse = {
    artist,
    past30d,
    past12w,
  }
  return response
}

const resolvers = {
  Query: {
    playtimeSummary,
    dashStats,
    artistStats,
  }
}

export const schema = makeExecutableSchema({typeDefs, resolvers})

