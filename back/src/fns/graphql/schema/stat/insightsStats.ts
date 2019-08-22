import { makeExecutableSchema } from "graphql-tools";
import { TableStat, TTableStat, PeriodType } from "../../../../shared/tables/TableStat";
import * as moment from 'moment'
import { TableUser } from "../../../../shared/tables/TableUser";
import { verifyEnv } from "../../../../shared/env";

const typeDefs = `
type Query {
  insightsStats(uid: String!, gid: String!): InsightsStatsResponse!
}

type InsightsStatsResponse {
  today: TimescopeStats!
  thisWeek: TimescopeStats!
  thisMonth: TimescopeStats!
  lifetime: TimescopeStats!
}

type TimescopeStats {
  personal: PerspectiveStats!
  group: PerspectiveStats!
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

const playtimePerspectiveStats = async (tableStat: TTableStat, uid: string, periodType: PeriodType, periodCurrent: string, periodPrev?: string) => {
  const currentMs = await tableStat.getStat({uid, periodType, periodValue: periodCurrent})
  const current = hrsMaybeMins(hrsAndMins(currentMs))
  if (!periodPrev) {
    return { current }
  }
  const prevMs = await tableStat.getStat({uid, periodType, periodValue: periodPrev})
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

const playtimeTimescopeStats = async (tableStat: TTableStat, uid: string, gid: string, periodType: PeriodType, periodCurrent: string, periodPrev?: string) => ({
  personal: await playtimePerspectiveStats(tableStat, uid, periodType, periodCurrent, periodPrev),
  group: await playtimePerspectiveStats(tableStat, 'global', periodType, periodCurrent, periodPrev),
})

const playtimeStats = async (tableStat: TTableStat, uid: string, gid: string, now: moment.Moment) => {

  const { day: today, week: thisWeek, month: thisMonth } = tableStat.periodsFor(localizedISOString(now))
  const { day: yest } = tableStat.periodsFor(localizedISOString(now.clone().subtract(1, 'days')))
  const { week: lastWeek } = tableStat.periodsFor(localizedISOString(now.clone().subtract(1, 'weeks')))
  const { month: lastMonth } = tableStat.periodsFor(localizedISOString(now.clone().subtract(1, 'months')))
  
  return {
    today: await playtimeTimescopeStats(tableStat, uid, gid, 'day', today, yest),
    thisWeek: await playtimeTimescopeStats(tableStat, uid, gid, 'week', thisWeek, lastWeek),
    thisMonth: await playtimeTimescopeStats(tableStat, uid, gid, 'month', thisMonth, lastMonth),
    lifetime: await playtimeTimescopeStats(tableStat, uid, gid, 'life', 'life'),
  }
}

const insightsStats = async (_, {uid, gid}, context) => {
  const log = context.log
  log.info('called by', { uid })
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    TABLE_STAT: process.env.TABLE_STAT,
  }, log)

  const tableUser = TableUser(context.DYNAMO_ENDPOINT, context.TABLE_USER)
  const { valid, invalid }: any = await tableUser.getUser(uid)
  if (invalid) { throw new Error(`user info invalid for uid ${uid}`) }
  const { utcOffset }: any = valid

  const tableStat = TableStat(context.DYNAMO_ENDPOINT, context.TABLE_STAT)

  // @ts-ignore
  const now = localizedMoment(utcOffset, moment())

  return await playtimeStats(tableStat, uid, gid, now)
}

const resolvers = {
  Query: {
    insightsStats,
  }
}

export const insightsStatsSchema = makeExecutableSchema({typeDefs, resolvers})