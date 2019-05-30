import { makeExecutableSchema } from "graphql-tools";
import { TableStat, TTableStat, PeriodType, RelationType } from "../../../../shared/tables/TableStat";
import moment = require("moment");
import { TableUser } from "../../../../shared/tables/TableUser";
import { verifyEnv } from "../../../../shared/env";
import { InsightsDashResponseResolvers, InsightsDashResponse, TimescopeTops, PerspectiveTops, QueryResolvers } from "../../types";
import { timeSeries } from './shared/timeSeries';

const typeDefs = `
type Query {
  insightsDash(uid: String!, gid: String!): InsightsDashResponse!
}

type InsightsDashResponse {
  today: TimescopeTops!
  thisWeek: TimescopeTops!
  thisMonth: TimescopeTops!
  lifetime: TimescopeTops!
}

type TimescopeTops {
  timeSeries: Timeseries!
  personal: PerspectiveTops!
  group: PerspectiveTops!
}

type Timeseries {
  label: String!
  values: [TimeseriesValue!]!
}

type TimeseriesValue {
  period: String!
  personal: Float!
  group: Float!
}

type PerspectiveTops {
  artists: [TopArtistStat!]!
  genres: [TopGenreStat!]!
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

type TopGenreStat {
  personal: Float!
  group: Float!
  genre: String!
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

type PerspectiveTypes = 'personal' | 'group'

type TPerspectiveTopKeys = {
  perspectiveType: PerspectiveTypes,
  primaryId: string,
  secondaryId: string,
  periodType: PeriodType,
  periodValue: string
}

const perspectiveTopArtists = async (tableStat: TTableStat, {perspectiveType, primaryId, secondaryId, periodType, periodValue}: TPerspectiveTopKeys) => {
  const artistsPrimary = await tableStat.getTopArtists({uid: primaryId, periodType, periodValue, Limit: 3})
  return await Promise.all(artistsPrimary.map(async ({artist, playDurationMs}) => {
    const secondary = await tableStat.getArtistStat({uid: secondaryId, artistId: artist.id, periodType, periodValue})
    const personal = perspectiveType === 'personal' ? playDurationMs / 3600000 : secondary / 3600000
    const group = perspectiveType === 'group' ? playDurationMs / 3600000 : secondary / 3600000
    return {
      artist,
      personal,
      group,
    }
  }))
}

const perspectiveTopGenres = async (tableStat: TTableStat, {perspectiveType, primaryId, secondaryId, periodType, periodValue}: TPerspectiveTopKeys) => {
  const genresPrimary = await tableStat.getTopGenres({uid: primaryId, periodType, periodValue, Limit: 3})
  return await Promise.all(genresPrimary.map(async ({genre, playDurationMs}) => {
    const secondary = await tableStat.getGenreStat({uid: secondaryId, genre, periodType, periodValue})
    const personal = perspectiveType === 'personal' ? playDurationMs / 3600000 : secondary / 3600000
    const group = perspectiveType === 'group' ? playDurationMs / 3600000 : secondary / 3600000
    return {
      genre,
      personal,
      group,
    }
  }))
}

const perspectiveTopArtistAndGenres = async (tableStat: TTableStat, perspectiveTopKeys: TPerspectiveTopKeys): Promise<PerspectiveTops> => {
  return {
    artists: await perspectiveTopArtists(tableStat, perspectiveTopKeys),
    genres: await perspectiveTopGenres(tableStat, perspectiveTopKeys),
  }
}

type TMomentUnits = 'days' | 'weeks' | 'months'


type TTimescopeKeys = {
  timeseriesLabel: string
  timeseriesPeriodType: PeriodType
  endDate: moment.Moment
  unit: TMomentUnits
  distance: number
  uid: string
  gid: string
  periodType: PeriodType
}

const timescopeTopArtistAndGenres = async (tableStat: TTableStat, {timeseriesLabel, timeseriesPeriodType, endDate, unit, distance, uid, gid, periodType} : TTimescopeKeys): Promise<TimescopeTops> => {
  const { [periodType]: periodValue } = tableStat.periodsFor(localizedISOString(endDate))
  return {
    timeSeries: await timeSeries(tableStat, timeseriesLabel, {endDate, unit, distance, uid, gid, periodType: timeseriesPeriodType, relationType: 'total', relationId: 'total'}),
    personal: await perspectiveTopArtistAndGenres(tableStat, {perspectiveType: 'personal', primaryId: uid, secondaryId: gid, periodType, periodValue}),
    group: await perspectiveTopArtistAndGenres(tableStat, {perspectiveType: 'group', primaryId: gid, secondaryId: uid, periodType, periodValue}),
  }
}

type TTopKeys = {
  uid: string,
  gid: string,
  now: moment.Moment
}

type PeriodKeys = {
  timeseriesLabel: string
  timeseriesPeriodType: PeriodType
  unit: TMomentUnits
  distance: number
  periodType: PeriodType

}
type SpecificPeriodKeys = {
  today: PeriodKeys
}
const PERIOD_KEYS: SpecificPeriodKeys = {
  today: {
    timeseriesLabel: 'past 7 days',
    timeseriesPeriodType: 'day',
    unit: 'days',
    distance: 7,
    periodType: 'day',
  }
}
const topArtistsAndGenres = async (tableStat: TTableStat, {uid, gid, now}: TTopKeys) => {
  const mainKeys = {uid, gid, endDate: now}
  // const x= Object.assign({periodType: 'day'}, mainKeys, PERIOD_KEYS.today)
  return {
    // today: await timescopeTopArtistAndGenres(tableStat, {timeseriesLabel: 'past 7 days', timeseriesPeriodType: 'day', endDate: now, unit: 'days', distance: 7, uid, gid, periodType: 'day'}),
    today: await timescopeTopArtistAndGenres(tableStat, Object.assign({periodType: 'day'}, mainKeys, PERIOD_KEYS.today)),
    thisWeek: await timescopeTopArtistAndGenres(tableStat, {timeseriesLabel: 'past 7 days', timeseriesPeriodType: 'day', endDate: now, unit: 'days', distance: 7, uid, gid, periodType: 'day'}),
    thisMonth: await timescopeTopArtistAndGenres(tableStat, {timeseriesLabel: 'past 30 days', timeseriesPeriodType: 'day', endDate: now, unit: 'days', distance: 30, uid, gid, periodType: 'day'}),
    lifetime: await timescopeTopArtistAndGenres(tableStat, {timeseriesLabel: 'past 12 weeks', timeseriesPeriodType: 'week', endDate: now, unit: 'weeks', distance: 12, uid, gid, periodType: 'week'}),
  }
}

const insightsDash: QueryResolvers.InsightsDashResolver = async (_, {uid, gid}, context) => {
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

  const ret = await topArtistsAndGenres(tableStat, {uid, gid, now})
  console.log('ret', ret)
  return ret
}

const resolvers = {
  Query: {
    insightsDash,
  }
}

export const insightsDashSchema = makeExecutableSchema({typeDefs, resolvers})