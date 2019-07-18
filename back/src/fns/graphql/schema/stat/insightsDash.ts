import { makeExecutableSchema } from "graphql-tools";
import { TableStat, TTableStat, PeriodType, RelationType } from "../../../../shared/tables/TableStat";
import moment = require("moment");
import { TableUser } from "../../../../shared/tables/TableUser";
import {
	TableAchievement,
	TTableAchievement
} from '../../../../shared/tables/TableAchievement'
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

type User {
  photoURL: String
  uid: String
  utcOffset: Int
  displayName: String
  lastUpdate: String
  sk: String
  totalUpdates: Int
  pk: String
  accessToken: String
  refreshToken: String
}

type TopListener {
  sk: String
  pk: String
  total: Float
  user: User
}

type Artist {
  id: String!
  name: String!
  images: [Image!]!
  external_urls: SpotifyUrl!
  genres: [String!]!
  topListeners: [TopListener]
}

type TopGenreStat {
  personal: Float!
  group: Float!
  genre: String!
}

`

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


const perspectiveTopGenres = async (
	tableStat: TTableStat,
	{
		perspectiveType,
		primaryId,
		secondaryId,
		periodType,
		periodValue
	}: TPerspectiveTopKeys
) => {
	const genresPrimary = await tableStat.getTopGenres({
		uid: primaryId,
		periodType,
		periodValue,
		Limit: 3
	})
	return await Promise.all(
		genresPrimary.map(async ({ genre, playDurationMs }) => {
			const secondary = await tableStat.getGenreStat({
				uid: secondaryId,
				genre,
				periodType,
				periodValue
			})
			const personal =
				perspectiveType === 'personal'
					? playDurationMs / 3600000
					: secondary / 3600000
			const group =
				perspectiveType === 'group'
					? playDurationMs / 3600000
					: secondary / 3600000
			return {
				genre,
				personal,
				group
			}
		})
	)
}


const perspectiveTopArtists = async (tableStat: TTableStat, tableAchievement: TTableAchievement, endDate: moment.Moment, { perspectiveType, primaryId, secondaryId, periodType, periodValue }: TPerspectiveTopKeys) => {
  
  const artistsPrimary = await tableStat.getTopArtists({ uid: primaryId, periodType, periodValue, Limit: 3 })
  
  
  return await Promise.all(artistsPrimary.map(async ({artist, playDurationMs}) => {
    
    let enrichedArtist = Object.assign({}, artist)
    enrichedArtist.topListeners = []

    const first = await tableAchievement.getArtistTopListeners(
			{artistId: artist.id,
			achievementType: 'topListener',
			achievementValue: 'first',
			periodType: 'life',
			periodValue: 'life',
			currentTime: endDate}
    )
    console.log('TCL: perspectiveTopArtists -> first', first)
    if (first) {
      enrichedArtist.topListeners.push(first)
    }
    const second = await tableAchievement.getArtistTopListeners({
			artistId: artist.id,
			achievementType: 'topListener',
			achievementValue: 'second',
			periodType: 'life',
			periodValue: 'life',
			currentTime: endDate
    })
    
    console.log('TCL: perspectiveTopArtists -> second', second)
if (second) {
	enrichedArtist.topListeners.push(second)
}
    const third = await tableAchievement.getArtistTopListeners({
			artistId: artist.id,
			achievementType: 'topListener',
			achievementValue: 'third',
			periodType: 'life',
			periodValue: 'life',
			currentTime: endDate
    })
    
    console.log('TCL: perspectiveTopArtists -> third', third)
     if (third) {
				enrichedArtist.topListeners.push(third)
			}
    
    console.log('TCL: perspectiveTopArtists -> enrichedArtist.topListeners', enrichedArtist.topListeners)
    
    console.log(enrichedArtist)
			const secondary = await tableStat.getArtistStat({
				uid: secondaryId,
				artistId: artist.id,
				periodType,
				periodValue
			})
    const personal = perspectiveType === 'personal' ? playDurationMs / 3600000 : secondary / 3600000
    const group = perspectiveType === 'group' ? playDurationMs / 3600000 : secondary / 3600000
    return {
			artist: enrichedArtist,
			personal,
			group
		}
  }))
}


const perspectiveTopArtistAndGenres = async (
	tableStat: TTableStat,
	tableAchievement: TTableAchievement,
	endDate: moment.Moment, perspectiveTopKeys: TPerspectiveTopKeys
): Promise<PerspectiveTops> => {
	const artists: any = await perspectiveTopArtists(
		tableStat,
    tableAchievement,
    endDate,
		perspectiveTopKeys
	)
	console.log('TCL: artists insightsDash', artists)
	return {
		artists: artists,
		genres: await perspectiveTopGenres(tableStat, perspectiveTopKeys)
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

const timescopeTopArtistAndGenres = async (tableStat: TTableStat, tableAchievement: TTableAchievement, {timeseriesLabel, timeseriesPeriodType, endDate, unit, distance, uid, gid, periodType} : TTimescopeKeys): Promise<TimescopeTops> => {
  const { [periodType]: periodValue } = tableStat.periodsFor(localizedISOString(endDate))
  return {
    timeSeries: await timeSeries(tableStat, timeseriesLabel, {endDate, unit, distance, uid, gid, periodType: timeseriesPeriodType, relationType: 'total', relationId: 'total'}),
    personal: await perspectiveTopArtistAndGenres(tableStat, tableAchievement, endDate,{perspectiveType: 'personal', primaryId: uid, secondaryId: gid, periodType, periodValue}),
    group: await perspectiveTopArtistAndGenres(tableStat, tableAchievement, endDate, {perspectiveType: 'group', primaryId: gid, secondaryId: uid, periodType, periodValue}),
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
const topArtistsAndGenres = async (tableStat: TTableStat, tableAchievement: TTableAchievement, {uid, gid, now}: TTopKeys) => {
  const mainKeys = {uid, gid, endDate: now}
  
  return {
 
    today: await timescopeTopArtistAndGenres(tableStat, tableAchievement, Object.assign({periodType: 'day'}, mainKeys, PERIOD_KEYS.today)),
    thisWeek: await timescopeTopArtistAndGenres(tableStat, tableAchievement, {timeseriesLabel: 'past 7 days', timeseriesPeriodType: 'day', endDate: now, unit: 'days', distance: 7, uid, gid, periodType: 'week'}),
    thisMonth: await timescopeTopArtistAndGenres(tableStat, tableAchievement, {timeseriesLabel: 'past 30 days', timeseriesPeriodType: 'day', endDate: now, unit: 'days', distance: 30, uid, gid, periodType: 'month'}),
    lifetime: await timescopeTopArtistAndGenres(tableStat, tableAchievement, {timeseriesLabel: 'past 12 weeks', timeseriesPeriodType: 'week', endDate: now, unit: 'weeks', distance: 12, uid, gid, periodType: 'life'}),
  }
}

const insightsDash: QueryResolvers.InsightsDashResolver = async (_, {uid, gid}, context) => {
  const log = context.log
  console.log('TCL: insightsDash:QueryResolvers.InsightsDashResolver -> context', context)
  log.info('called by', { uid })
  const env = verifyEnv(
		{
			DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
			TABLE_STAT: process.env.TABLE_STAT,
			TABLE_ACHIEVEMENT: process.env.TABLE_ACHIEVEMENT
		},
		log
	)

  const tableUser = TableUser(context.DYNAMO_ENDPOINT, context.TABLE_USER)
  const tableStat = TableStat(context.DYNAMO_ENDPOINT, context.TABLE_STAT)
  const tableAchievement = TableAchievement(
		context.DYNAMO_ENDPOINT,
		context.TABLE_ACHIEVEMENT
	)
  const { valid, invalid } = await tableUser.getUser(uid)
  if (invalid) { throw new Error(`user info invalid for uid ${uid}`) }
  
  const { utcOffset } = valid
  const now = localizedMoment(utcOffset, moment())

  const ret = await topArtistsAndGenres(tableStat, tableAchievement, {
		uid,
		gid,
		now
	})
  console.log('ret', ret)
  return ret
}

const resolvers = {
  Query: {
    insightsDash,
  }
}

export const insightsDashSchema = makeExecutableSchema({typeDefs, resolvers})