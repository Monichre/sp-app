import { makeExecutableSchema } from 'graphql-tools'
import {
	TableStat,
	TTableStat,
	PeriodType
} from '../../../../shared/tables/TableStat'
import * as moment from 'moment'
import { TableUser } from '../../../../shared/tables/TableUser'
import { verifyEnv } from '../../../../shared/env'
import {
	QueryResolvers
} from '../../types'
import { timeSeries, TMomentUnits } from './shared/timeSeries'
import {
	TableAchievement,
	TTableAchievement,
	KeyData
} from '../../../../shared/tables/TableAchievement'


const typeDefs = `
type Query {
  insightsArtistStats(uid: String!, gid: String!, artistId: String!): InsightsArtistStatsResponse!
}

type InsightsArtistStatsResponse {
  artist: Artist!
  today: TimescopeStats!
  thisWeek: TimescopeStats!
  thisMonth: TimescopeStats!
  lifetime: TimescopeStats!
}
type User {
  photoURL: String
  uid: String
  email: String
  achievements: [String]
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
type Image {
  url: String!
}
type SpotifyUrl {
  spotify: String!
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


type EnrichedKeyMakerParams = {
	perspective: string
	relationType: 'artist'
	periodType: PeriodType
	periodValue: string
	artistId: string
	achievementType: 'topListener'
	achievementValue: 'first' | 'second' | 'third'
}

const keyMaker = (args: any) => [...args].join('#')
const keyMakerPlaceAndDay = ({
	perspective,
	relationType,
	periodType,
	periodValue,
	artistId,
	achievementType,
	achievementValue
}: EnrichedKeyMakerParams) => {
	const pk = keyMaker([
		perspective,
		relationType,
		periodType,
		periodValue,
		achievementType,
		achievementValue
	])
	const sk = keyMaker([
		perspective,
		periodType,
		artistId,
		achievementType,
		achievementValue
	])
	return {
		sk,
		pk
	}
}


const localizedMoment = (utcOffset: number, m: moment.Moment) =>
	moment.utc(m).utcOffset(utcOffset, false)

const localizedISOString = (m: moment.Moment) => m.toISOString(true)

export const hrsAndMins = (durationMs: number) => {
	const d = moment.duration(durationMs)
	return {
		hrs: Math.abs(Math.trunc(d.asHours())),
		mins: Math.abs(d.minutes())
	}
}

const hrsMaybeMins = ({ hrs, mins }: { hrs: number; mins: number }) =>
	hrs > 100 ? { hrs } : { hrs, mins }

const playtimePerspectiveStats = async (
	tableStat: TTableStat,
	uid: string,
	artistId: string,
	periodType: PeriodType,
	periodCurrent: string,
	periodPrev?: string
) => {
	const currentMs = await tableStat.getArtistStat({
		uid,
		periodType,
		periodValue: periodCurrent,
		artistId
	})
	const current = hrsMaybeMins(hrsAndMins(currentMs))
	if (!periodPrev) {
		return { current }
	}
	const prevMs = await tableStat.getArtistStat({
		uid,
		periodType,
		periodValue: periodPrev,
		artistId
	})
	const deltaMs = currentMs - prevMs
	const direction: 'up' | 'down' | null =
		deltaMs == 0 ? null : deltaMs >= 0 ? 'up' : 'down'

	const delta =
		deltaMs == 0
			? null
			: {
					direction,
					...hrsMaybeMins(hrsAndMins(deltaMs))
			  }

	return {
		current,
		delta
	}
}

type TPlaytimeTimescopeStatsKeys = {
	timeseriesLabel: string
	timeseriesPeriodType: PeriodType
	uid: string
	gid: string
	artistId: string
	endDate: moment.Moment
	unit: TMomentUnits
	distance: number
	periodType: PeriodType
	periodCurrent: string
	periodPrev?: string
}

const playtimeTimescopeStats = async (
	tableStat: TTableStat,
	{
		timeseriesLabel,
		timeseriesPeriodType,
		uid,
		gid,
		artistId,
		endDate,
		unit,
		distance,
		periodType,
		periodCurrent,
		periodPrev
	}: TPlaytimeTimescopeStatsKeys
) => ({
	timeseries: await timeSeries(tableStat, timeseriesLabel, {
		endDate,
		unit,
		distance,
		uid,
		gid,
		periodType: timeseriesPeriodType,
		relationType: 'artist',
		relationId: artistId
	}),
	personal: await playtimePerspectiveStats(
		tableStat,
		uid,
		artistId,
		periodType,
		periodCurrent,
		periodPrev
	),
	group: await playtimePerspectiveStats(
		tableStat,
		'global',
		artistId,
		periodType,
		periodCurrent,
		periodPrev
	)
})

const playtimeStats = async (
	tableStat: TTableStat,
	tableAchievement: TTableAchievement,
	uid: string,
	gid: string,
	artistId: string,
	now: moment.Moment
) => {
	const {
		day: today,
		week: thisWeek,
		month: thisMonth,
		life
	} = tableStat.periodsFor(localizedISOString(now))
	const { day: yest } = tableStat.periodsFor(
		localizedISOString(now.clone().subtract(1, 'days'))
	)
	const { week: lastWeek } = tableStat.periodsFor(
		localizedISOString(now.clone().subtract(1, 'weeks'))
	)
	const { month: lastMonth } = tableStat.periodsFor(
		localizedISOString(now.clone().subtract(1, 'months'))
	)

	const artist = await tableStat.getArtistInfo(artistId)
		const firstKeysDaily = keyMakerPlaceAndDay({
			perspective: gid,
			relationType: 'artist',
			periodType: 'day',
			periodValue: today,
			artistId: artistId,
			achievementType: 'topListener',
			achievementValue: 'first'
		})
		const secondKeysDaily = keyMakerPlaceAndDay({
			perspective: gid,
			relationType: 'artist',
			periodType: 'day',
			periodValue: today,
			artistId: artistId,
			achievementType: 'topListener',
			achievementValue: 'second'
		})
		const thirdKeysDaily = keyMakerPlaceAndDay({
			perspective: gid,
			relationType: 'artist',
			periodType: 'day',
			periodValue: today,
			artistId: artistId,
			achievementType: 'topListener',
			achievementValue: 'third'
		})

		const keys = [firstKeysDaily, secondKeysDaily, thirdKeysDaily]
		const dailyTopListeners = await Promise.all(
			keys.map(async (keyData: KeyData) => {
				const data = await tableAchievement.getArtistTopListeners(keyData)
				
				return data
			})
		)

	const topListeners: any = {}

	topListeners.daily = dailyTopListeners
	

	/**
	 *
	 * Weekly Enriched Top Artists w/Top Listeners
	 *
	 */

	const firstKeysWeekly = keyMakerPlaceAndDay({
		perspective: gid,
		relationType: 'artist',
		periodType: 'week',
		periodValue: thisWeek,
		artistId: artistId,
		achievementType: 'topListener',
		achievementValue: 'first'
	})
	const secondKeysWeekly = keyMakerPlaceAndDay({
		perspective: gid,
		relationType: 'artist',
		periodType: 'week',
		periodValue: thisWeek,
		artistId: artistId,
		achievementType: 'topListener',
		achievementValue: 'second'
	})
	const thirdKeysWeekly = keyMakerPlaceAndDay({
		perspective: gid,
		relationType: 'artist',
		periodType: 'week',
		periodValue: thisWeek,
		artistId: artistId,
		achievementType: 'topListener',
		achievementValue: 'third'
	})

	const keysWeekly = [firstKeysWeekly, secondKeysWeekly, thirdKeysWeekly]
	const weeklyTopListeners = await Promise.all(
		keysWeekly.map(async (keyData: KeyData) => {
			const data = await tableAchievement.getArtistTopListeners(keyData)
			
			return data
		})
	)

	topListeners.weekly = weeklyTopListeners

	/**
	 *
	 * Monthly Top Artists Enriched w/TopListeners
	 *
	 */

	const firstKeysMonthly = keyMakerPlaceAndDay({
		perspective: gid,
		relationType: 'artist',
		periodType: 'month',
		periodValue: thisMonth,
		artistId: artistId,
		achievementType: 'topListener',
		achievementValue: 'first'
	})
	const secondKeysMonthly = keyMakerPlaceAndDay({
		perspective: gid,
		relationType: 'artist',
		periodType: 'month',
		periodValue: thisMonth,
		artistId: artistId,
		achievementType: 'topListener',
		achievementValue: 'second'
	})
	const thirdKeysMonthly = keyMakerPlaceAndDay({
		perspective: gid,
		relationType: 'artist',
		periodType: 'month',
		periodValue: thisMonth,
		artistId: artistId,
		achievementType: 'topListener',
		achievementValue: 'third'
	})

	const keysMonthly = [firstKeysMonthly, secondKeysMonthly, thirdKeysMonthly]
	const monthlyTopListeners = await Promise.all(
		keysMonthly.map(async (keyData: KeyData) => {
			const data = await tableAchievement.getArtistTopListeners(keyData)
			
			return data
		})
	)

	topListeners.monthly = monthlyTopListeners

	/**
	 *
	 * LifeTime Top Artists w/Listeners
	 *
	 */

	const firstKeysLifetime = keyMakerPlaceAndDay({
		perspective: gid,
		relationType: 'artist',
		periodType: 'life',
		periodValue: 'life',
		artistId: artistId,
		achievementType: 'topListener',
		achievementValue: 'first'
	})
	const secondKeysLifetime = keyMakerPlaceAndDay({
		perspective: gid,
		relationType: 'artist',
		periodType: 'life',
		periodValue: 'life',
		artistId: artistId,
		achievementType: 'topListener',
		achievementValue: 'second'
	})
	const thirdKeysLifetime = keyMakerPlaceAndDay({
		perspective: gid,
		relationType: 'artist',
		periodType: 'life',
		periodValue: 'life',
		artistId: artistId,
		achievementType: 'topListener',
		achievementValue: 'third'
	})

	const keysLifetime = [firstKeysLifetime, secondKeysLifetime, thirdKeysLifetime]
	const lifetimeTopListeners = await Promise.all(
		keysLifetime.map(async (keyData: KeyData) => {
			const data = await tableAchievement.getArtistTopListeners(keyData)
			
			return data
		})
	)

	topListeners.lifetime = lifetimeTopListeners

	artist.topListeners = topListeners
    


	return {
		artist,
		today: await playtimeTimescopeStats(tableStat, {
			uid,
			gid,
			artistId,
			periodType: 'day',
			periodCurrent: today,
			endDate: now,
			periodPrev: yest,
			timeseriesLabel: 'past 7 days',
			timeseriesPeriodType: 'day',
			unit: 'days',
			distance: 7
		}),
		thisWeek: await playtimeTimescopeStats(tableStat, {
			uid,
			gid,
			artistId,
			periodType: 'week',
			periodCurrent: thisWeek,
			endDate: now,
			periodPrev: lastWeek,
			timeseriesLabel: 'past 7 days',
			timeseriesPeriodType: 'day',
			unit: 'days',
			distance: 7
		}),
		thisMonth: await playtimeTimescopeStats(tableStat, {
			uid,
			gid,
			artistId,
			periodType: 'month',
			periodCurrent: thisMonth,
			endDate: now,
			periodPrev: lastMonth,
			timeseriesLabel: 'past 30 days',
			timeseriesPeriodType: 'day',
			unit: 'days',
			distance: 30
		}),
		lifetime: await playtimeTimescopeStats(tableStat, {
			uid,
			gid,
			artistId,
			periodType: 'life',
			periodCurrent: life,
			endDate: now,
			timeseriesLabel: 'past 12 weeks',
			timeseriesPeriodType: 'week',
			unit: 'weeks',
			distance: 12
		})
		// thisWeek: await playtimeTimescopeStats(tableStat, uid, gid, artistId, 'week', thisWeek, lastWeek),
		// thisMonth: await playtimeTimescopeStats(tableStat, uid, gid, artistId, 'month', thisMonth, lastMonth),
		// lifetime: await playtimeTimescopeStats(tableStat, uid, gid, artistId, 'life', 'life'),
	}
}

const insightsArtistStats: QueryResolvers.InsightsArtistStatsResolver = async (
	_,
	{ uid, gid, artistId },
	context
) => {
	const log = context.log
	log.info('called by', { uid })
	const env = verifyEnv(
		{
			DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
			TABLE_STAT: process.env.TABLE_STAT,
			TABLE_ACHIEVEMENT: process.env.TABLE_ACHIEVEMENT
		},
		log
	)

	const tableStat = TableStat(context.DYNAMO_ENDPOINT, context.TABLE_STAT)
	const tableUser = TableUser(context.DYNAMO_ENDPOINT, context.TABLE_USER)
	const tableAchievement = TableAchievement(
		context.DYNAMO_ENDPOINT,
		context.TABLE_ACHIEVEMENT
	)
	const { valid, invalid }:any = await tableUser.getUser(uid)
	if (invalid) {
		throw new Error(`user info invalid for uid ${uid}`)
	}
	const { utcOffset } = valid

	// @ts-ignore
	const now = localizedMoment(utcOffset, moment())

	const playTimeStats: any = await playtimeStats(
		tableStat,
		tableAchievement,
		uid,
		gid,
		artistId,
		now
	)

	return playTimeStats
}

const resolvers = {
	Query: {
		insightsArtistStats
	}
}

export const insightsArtistStatsSchema = makeExecutableSchema({
	typeDefs,
	resolvers
})
