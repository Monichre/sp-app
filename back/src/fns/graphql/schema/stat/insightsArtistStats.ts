import { makeExecutableSchema } from 'graphql-tools'
import {
	TableStat,
	TTableStat,
	PeriodType
} from '../../../../shared/tables/TableStat'
import moment = require('moment')
import { TableUser } from '../../../../shared/tables/TableUser'
import { verifyEnv } from '../../../../shared/env'
import {
	InsightsArtistStatsResponse,
	InsightsArtistStatsResponseResolvers,
	QueryResolvers
} from '../../types'
import { timeSeries, TMomentUnits } from './shared/timeSeries'
import {
	TableAchievement,
	TTableAchievement
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
	console.log('TCL: artist', artist)
	let enrichedArtist = Object.assign({}, artist)

	enrichedArtist.topListeners = []

	const first = await tableAchievement.getArtistTopListeners({
		artistId: artist.id,
		achievementType: 'topListener',
		achievementValue: 'first',
		periodType: 'life',
		periodValue: 'life',
		currentTime: now
	})
	console.log('TCL: perspectiveTopArtists -> first', first)
	if (first) {
		enrichedArtist.topListeners.push(first)

		const second = await tableAchievement.getArtistTopListeners({
			artistId: artist.id,
			achievementType: 'topListener',
			achievementValue: 'second',
			periodType: 'life',
			periodValue: 'life',
			currentTime: now
		})

		console.log('TCL: perspectiveTopArtists -> second', second)
		if (second && first.user.pk !== second.user.pk) {
			enrichedArtist.topListeners.push(second)

			const third = await tableAchievement.getArtistTopListeners({
				artistId: artist.id,
				achievementType: 'topListener',
				achievementValue: 'third',
				periodType: 'life',
				periodValue: 'life',
				currentTime: now
			})

			console.log('TCL: perspectiveTopArtists -> third', third)
			if (
				third &&
				(second.user.pk !== third.user.pk && third.user.pk !== first.user.pk)
			) {
				enrichedArtist.topListeners.push(third)
			}

			console.log(
				'TCL: perspectiveTopArtists -> enrichedArtist.topListeners',
				enrichedArtist.topListeners
			)
		}
	}

	console.log(
		'TCL: perspectiveTopArtists -> enrichedArtist.topListeners',
		enrichedArtist.topListeners
	)

	console.log(enrichedArtist)

	return {
		artist: enrichedArtist,
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
	const { valid, invalid } = await tableUser.getUser(uid)
	if (invalid) {
		throw new Error(`user info invalid for uid ${uid}`)
	}
	const { utcOffset } = valid

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
