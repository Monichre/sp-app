import * as R from 'ramda';
import { makeExecutableSchema } from "graphql-tools";
import { TableStat, TTableStat, PeriodType } from "../../../../shared/tables/TableStat";
import moment = require("moment");
import { TableUser } from "../../../../shared/tables/TableUser";
import { verifyEnv } from "../../../../shared/env";
import { InsightsDashResponseResolvers, InsightsDashResponse, TimescopeTops, PerspectiveTops, InsightsArtistsResponse, TimescopeTopArtists, TopArtistStat } from "../../types";

const typeDefs = `
type Query {
  insightsArtists(uid: String!, gid: String!): InsightsArtistsResponse!
}

type InsightsArtistsResponse {
  today: TimescopeTopArtists!
  thisWeek: TimescopeTopArtists!
  thisMonth: TimescopeTopArtists!
  lifetime: TimescopeTopArtists!
}

type TimescopeTopArtists {
  personal: [TopArtistStat!]!
  group: [TopArtistStat!]!
}


type TopArtistStat {
  personal: Float!
  group: Float!
  artist: Artist!
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

`


// none of the other ones do what we want -- leaving here for reference
// const localt = moment(dts).utcOffset(utcOffset, true).toISOString(true)
// const localf = moment(dts).utcOffset(utcOffset, false).toISOString(true)
// const utct = moment.utc(dts).utcOffset(utcOffset, true).toISOString(true)
// const pzt = moment.parseZone(dts).utcOffset(utcOffset, true).toISOString(true)
// const pzf = moment.parseZone(dts).utcOffset(utcOffset, false).toISOString(true)
const localizedMoment = (utcOffset: number, m: moment.Moment) =>
  moment.utc(m).utcOffset(utcOffset, false)

const localizedISOString = (m: moment.Moment) => m.toISOString(true)

type SpotifyUrl = {
  spotify: string
}
type Image = {
  url: string
}
type Artist = {
  id: string,
  name: string,
  images: Image[],
  external_urls: SpotifyUrl
  genres: string[]
}
// type TopGenresRow = {
//   name: string,
//   playDurationMs: number,
// }

type TopArtistsRow = {
  artist: Artist,
  playDurationMs: number,
}

// type ArtistPeriodsRow = {
//   period: string,
//   playDurationMs: number,
// }

// const byTimeThenArtistName = R.sortWith<TopArtistsRow>([
//   R.descend(R.prop('playDurationMs')),
//   R.ascend(R.path(['artist', 'name']))
// ])

// const topArtistsFor = async (doc: AWS.DynamoDB.DocumentClient, TableName, uid: string, periodName, periodValue, Limit = 5) => {
//   const params = {
//     TableName,
//     Limit,
//     KeyConditionExpression: `pk = :pk`,
//     IndexName: 'LSIPlayDuration',
//     ScanIndexForward: false,
//     ExpressionAttributeValues: {
//       ':pk': [uid, 'artist', periodName, periodValue].join('#')
//     }
//   }
//   return await doc.query(params).promise()
//     .then(d => d.Items.map(i => ({artist: i.artist, playDurationMs: i.playDurationMs})))
//     .then(byTimeThenArtistName)
// }

type PerspectiveTypes = 'personal' | 'group'

const perspectiveTopArtists = async (tableStat: TTableStat, primaryUid: string, primaryType: PerspectiveTypes, secondaryUid: string, secondaryType: PerspectiveTypes, periodType: PeriodType, periodCurrent: string, periodPrev?: string): Promise<TopArtistStat[]> => {
  const artistsPrimary = await tableStat.getTopArtists({uid: primaryUid, periodType, periodValue: periodCurrent, Limit: 20})
  const artists = await Promise.all(artistsPrimary.map(async ({artist, playDurationMs}) => {
    const secondary = await tableStat.getArtistStat({uid: secondaryUid, artistId: artist.id, periodType, periodValue: periodCurrent})
    const personal = primaryType === 'personal' ? playDurationMs / 3600000 : secondary / 3600000
    const group = primaryType === 'group' ? playDurationMs / 3600000 : secondary / 3600000
    return {
      artist,
      personal,
      group,
    }
  }))

  return artists
}

const timescopeTopArtists = async (tableStat: TTableStat, uid: string, gid: string, periodType: PeriodType, periodCurrent: string, periodPrev?: string): Promise<TimescopeTopArtists> => ({
  personal: await perspectiveTopArtists(tableStat, uid, 'personal', 'global', 'group', periodType, periodCurrent, periodPrev),
  group: await perspectiveTopArtists(tableStat, 'global', 'group', uid, 'personal', periodType, periodCurrent, periodPrev),
})

const topArtists = async (tableStat: TTableStat, uid: string, gid: string, now: moment.Moment) => {
  const { day: today, week: thisWeek, month: thisMonth } = tableStat.periodsFor(localizedISOString(now))
  const { day: yest } = tableStat.periodsFor(localizedISOString(now.subtract(1, 'days')))
  const { week: lastWeek } = tableStat.periodsFor(localizedISOString(now.subtract(1, 'days')))
  const { month: lastMonth } = tableStat.periodsFor(localizedISOString(now.subtract(1, 'days')))

  return {
    today: await timescopeTopArtists(tableStat, uid, gid, 'day', today, yest),
    thisWeek: await timescopeTopArtists(tableStat, uid, gid, 'week', thisWeek, lastWeek),
    thisMonth: await timescopeTopArtists(tableStat, uid, gid, 'month', thisMonth, lastMonth),
    lifetime: await timescopeTopArtists(tableStat, uid, gid, 'life', 'life'),
  }
}
const insightsArtists = async (_, {uid, gid}, context): Promise<InsightsArtistsResponse> => {
  const log = context.log
  log.info('called by', { uid })
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    TABLE_STAT: process.env.TABLE_STAT,
  }, log)

  const tableUser = TableUser(context.DYNAMO_ENDPOINT, context.TABLE_USER)
  const { valid, invalid } = await tableUser.getUser(uid)
  if (invalid) { throw new Error(`user info invalid for uid ${uid}`) }
  const { utcOffset } = valid

  const tableStat = TableStat(context.DYNAMO_ENDPOINT, context.TABLE_STAT)

  const now = localizedMoment(utcOffset, moment())

  const ret = await topArtists(tableStat, uid, gid, now)
  console.log('ret', ret)
  return ret
}

const resolvers = {
  Query: {
    insightsArtists,
  }
}

export const insightsArtistsSchema = makeExecutableSchema({typeDefs, resolvers})