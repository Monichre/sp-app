import { makeExecutableSchema } from "graphql-tools";
import { TableStat, TTableStat, PeriodType } from "../../../../shared/tables/TableStat";
import * as moment from "moment"
import { TableUser } from "../../../../shared/tables/TableUser";
import { verifyEnv } from "../../../../shared/env";
import { InsightsArtistStatsResponse, InsightsArtistStatsResponseResolvers, QueryResolvers } from "../../types";
import { timeSeries, TMomentUnits } from "./shared/timeSeries";

const typeDefs = `
type Query {
  insightsGenreStats(uid: String!, gid: String!, genre: String!): InsightsGenreStatsResponse!
}

type InsightsGenreStatsResponse {
  genre: String!
  today: TimescopeStats!
  thisWeek: TimescopeStats!
  thisMonth: TimescopeStats!
  lifetime: TimescopeStats!
}

type TimescopeStats {
  timeseries: Timeseries!
  personal: PerspectiveStats!
  group: PerspectiveStats!
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

type PerspectiveStats {
  current: Duration!
  delta: Delta
}

type Duration {
  hrs: Float!
  mins: Float
}

type Delta {
  hrs: Float!
  mins: Float
  direction: String
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

export const hrsAndMins = (durationMs: number) => {
  const d = moment.duration(durationMs)
  return {
    hrs: Math.abs(Math.trunc(d.asHours())),
    mins: Math.abs(d.minutes()),
  }
}

const hrsMaybeMins = ({hrs, mins}: {hrs: number, mins: number}) =>
  hrs > 100 ? { hrs } : { hrs, mins }

const playtimePerspectiveStats = async (tableStat: TTableStat, uid: string, genre: string, periodType: PeriodType, periodCurrent: string, periodPrev?: string) => {
  const currentMs = await tableStat.getGenreStat({uid, periodType, periodValue: periodCurrent, genre})
  const current = hrsMaybeMins(hrsAndMins(currentMs))
  if (!periodPrev) {
    return { current }
  }
  const prevMs = await tableStat.getGenreStat({uid, periodType, periodValue: periodPrev, genre})
  const deltaMs = currentMs - prevMs
  const direction: 'up' | 'down' | null = deltaMs == 0 ? null : (deltaMs >= 0 ? 'up' : 'down')

  const delta = deltaMs == 0 ? null :
    {
      direction,
      ...hrsMaybeMins(hrsAndMins(deltaMs)),
    }

  return {
    current,
    delta,
  }
}

type TPlaytimeTimescopeStatsKeys = {
  timeseriesLabel: string
  timeseriesPeriodType: PeriodType
  uid: string
  gid: string
  genre: string
  endDate: moment.Moment
  unit: TMomentUnits
  distance: number
  periodType: PeriodType
  periodCurrent: string
  periodPrev?: string
}

const playtimeTimescopeStats = async (tableStat: TTableStat, {timeseriesLabel, timeseriesPeriodType, uid, gid, genre, endDate, unit, distance, periodType, periodCurrent, periodPrev}: TPlaytimeTimescopeStatsKeys) => ({
  timeseries: await timeSeries(tableStat, timeseriesLabel, { endDate, unit, distance, uid, gid, periodType: timeseriesPeriodType, relationType: 'genre', relationId: genre}),
  personal: await playtimePerspectiveStats(tableStat, uid, genre, periodType, periodCurrent, periodPrev),
  group: await playtimePerspectiveStats(tableStat, 'global', genre, periodType, periodCurrent, periodPrev),
})

const playtimeStats = async (tableStat: TTableStat, uid: string, gid: string, genre: string, now: moment.Moment) => {
  const { day: today, week: thisWeek, month: thisMonth, life } = tableStat.periodsFor(localizedISOString(now))
  const { day: yest } = tableStat.periodsFor(localizedISOString(now.clone().subtract(1, 'days')))
  const { week: lastWeek } = tableStat.periodsFor(localizedISOString(now.clone().subtract(1, 'weeks')))
  const { month: lastMonth } = tableStat.periodsFor(localizedISOString(now.clone().subtract(1, 'months')))
  
  return {
    genre,
    today: await playtimeTimescopeStats(tableStat, {uid, gid, genre, periodType: 'day', periodCurrent: today, endDate: now, periodPrev: yest, timeseriesLabel: 'past 7 days', timeseriesPeriodType: 'day', unit: 'days', distance: 7}),
    thisWeek: await playtimeTimescopeStats(tableStat, {uid, gid, genre, periodType: 'week', periodCurrent: thisWeek, endDate: now, periodPrev: lastWeek, timeseriesLabel: 'past 7 days', timeseriesPeriodType: 'day', unit: 'days', distance: 7}),
    thisMonth: await playtimeTimescopeStats(tableStat, {uid, gid, genre, periodType: 'month', periodCurrent: thisMonth, endDate: now, periodPrev: lastMonth, timeseriesLabel: 'past 30 days', timeseriesPeriodType: 'day', unit: 'days', distance: 30}),
    lifetime: await playtimeTimescopeStats(tableStat, {uid, gid, genre, periodType: 'life', periodCurrent: life, endDate: now, timeseriesLabel: 'past 12 weeks', timeseriesPeriodType: 'week', unit: 'weeks', distance: 12}),
    // thisWeek: await playtimeTimescopeStats(tableStat, uid, gid, artistId, 'week', thisWeek, lastWeek),
    // thisMonth: await playtimeTimescopeStats(tableStat, uid, gid, artistId, 'month', thisMonth, lastMonth),
    // lifetime: await playtimeTimescopeStats(tableStat, uid, gid, artistId, 'life', 'life'),
  }
}

const insightsGenreStats: QueryResolvers.InsightsGenreStatsResolver = async (_, {uid, gid, genre}, context) => {
  const log = context.log
  log.info('called by', { uid })
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    TABLE_STAT: process.env.TABLE_STAT,
  }, log)

  const tableUser = TableUser(context.DYNAMO_ENDPOINT, context.TABLE_USER)
  const { valid, invalid } = await tableUser.getUser(uid)
  if (invalid) { throw new Error(`user info invalid for uid ${uid}`) }

  // @ts-ignore
  const { utcOffset } = valid

  const tableStat = TableStat(context.DYNAMO_ENDPOINT, context.TABLE_STAT)


  // @ts-ignore
  const now = localizedMoment(utcOffset, moment())

  return await playtimeStats(tableStat, uid, gid, genre, now)
}

const resolvers = {
  Query: {
    insightsGenreStats,
  }
}

export const insightsGenreStatsSchema = makeExecutableSchema({ typeDefs, resolvers })

