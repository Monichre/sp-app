import * as R from 'ramda';
import { makeExecutableSchema } from "graphql-tools";
import { TableStat, TTableStat, PeriodType } from "../../../../shared/tables/TableStat";
import * as moment from 'moment'
import { TableUser } from "../../../../shared/tables/TableUser";
import { verifyEnv } from "../../../../shared/env";
import { InsightsDashResponseResolvers, InsightsDashResponse, TimescopeTops, PerspectiveTops, InsightsGenresResponse, TimescopeTopGenres, TopGenreStat, QueryResolvers } from "../../types";
import { TopListenerData } from './insightsArtists';

const typeDefs = `
type Query {
  insightsGenres(uid: String!, gid: String!): InsightsGenresResponse!
}

type InsightsGenresResponse {
  today: TimescopeTopGenres!
  thisWeek: TimescopeTopGenres!
  thisMonth: TimescopeTopGenres!
  lifetime: TimescopeTopGenres!
}

type TimescopeTopGenres {
  personal: [TopGenreStat!]!
  group: [TopGenreStat!]!
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

type SpotifyUrl = {
  spotify: string
}
type Image = {
  url: string
}
type Artist = {
	id: string
	name: string
	images: Image[]
	external_urls: SpotifyUrl
	genres: string[]
	topListeners: TopListenerData
}

type TopArtistsRow = {
  artist: Artist,
  playDurationMs: number,
}

type PerspectiveTypes = 'personal' | 'group'

const topArtistsToWat = (rows: TopArtistsRow[]) =>
  rows.map(r =>({
    personal: r.playDurationMs / 3600000,
    group: 0,
    artist: r.artist
  }))

const perspectiveTopGenres = async (tableStat: TTableStat, primaryUid: string, primaryType: PerspectiveTypes, secondaryUid: string, secondaryType: PerspectiveTypes, periodType: PeriodType, periodCurrent: string, periodPrev?: string): Promise<TopGenreStat[]> => {
  const genresPrimary = await tableStat.getTopGenres({uid: primaryUid, periodType, periodValue: periodCurrent, Limit: 20})
  const genres = await Promise.all(genresPrimary.map(async ({ genre, playDurationMs }) => {
    const secondary = await tableStat.getGenreStat({uid: secondaryUid, genre, periodType, periodValue: periodCurrent})
    // const secondary = Math.random() * 10000000
    const personal = primaryType === 'personal' ? playDurationMs / 3600000 : secondary / 3600000
    const group = primaryType === 'group' ? playDurationMs / 3600000 : secondary / 3600000
    return {
      genre,
      personal,
      group,
    }
  }))
  return genres
}

const timescopeTopGenres = async (tableStat: TTableStat, uid: string, gid: string, periodType: PeriodType, periodCurrent: string, periodPrev?: string): Promise<TimescopeTopGenres> => ({
  personal: await perspectiveTopGenres(tableStat, uid, 'personal', 'global', 'group', periodType, periodCurrent, periodPrev),
  group: await perspectiveTopGenres(tableStat, 'global', 'group', uid, 'personal', periodType, periodCurrent, periodPrev),
})

const topGenres = async (tableStat: TTableStat, uid: string, gid: string, now: moment.Moment): Promise<InsightsGenresResponse> => {
  const { day: today, week: thisWeek, month: thisMonth } = tableStat.periodsFor(localizedISOString(now))
  const { day: yest } = tableStat.periodsFor(localizedISOString(now.subtract(1, 'days')))
  const { week: lastWeek } = tableStat.periodsFor(localizedISOString(now.subtract(1, 'days')))
  const { month: lastMonth } = tableStat.periodsFor(localizedISOString(now.subtract(1, 'days')))

  return {
    today: await timescopeTopGenres(tableStat, uid, gid, 'day', today, yest),
    thisWeek: await timescopeTopGenres(tableStat, uid, gid, 'week', thisWeek, lastWeek),
    thisMonth: await timescopeTopGenres(tableStat, uid, gid, 'month', thisMonth, lastMonth),
    lifetime: await timescopeTopGenres(tableStat, uid, gid, 'life', 'life'),
  }
}
const insightsGenres: QueryResolvers.InsightsGenresResolver = async (_, {uid, gid}, {log, DYNAMO_ENDPOINT, TABLE_STAT, TABLE_USER}) => {
  log.info('called by', { uid })
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    TABLE_STAT: process.env.TABLE_STAT,
  }, log)

  const tableUser = TableUser(DYNAMO_ENDPOINT, TABLE_USER)
  const { valid, invalid } = await tableUser.getUser(uid)
  if (invalid) { throw new Error(`user info invalid for uid ${uid}`) }

  // @ts-ignore
  const { utcOffset } = valid

  const tableStat = TableStat(DYNAMO_ENDPOINT, TABLE_STAT)

// @ts-ignore
  const now = localizedMoment(utcOffset, moment())

  const ret = await topGenres(tableStat, uid, gid, now)
  console.log('ret', ret)
  return ret
}

const resolvers = {
  Query: {
    insightsGenres,
  }
}

export const insightsGenresSchema = makeExecutableSchema({typeDefs, resolvers})