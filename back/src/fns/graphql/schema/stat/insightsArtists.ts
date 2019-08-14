import * as R from 'ramda'
import { makeExecutableSchema } from 'graphql-tools'
import {
	TableStat,
	TTableStat,
	PeriodType
} from '../../../../shared/tables/TableStat'
import * as moment from 'moment'
import { TableUser } from '../../../../shared/tables/TableUser'
import { verifyEnv } from '../../../../shared/env'
import { KeyData } from '../../../../shared/tables/TableAchievement'
import {
	InsightsDashResponseResolvers,
	InsightsDashResponse,
	TimescopeTops,
	PerspectiveTops,
	InsightsArtistsResponse,
	TimescopeTopArtists,
	TopArtistStat,
	QueryResolvers,
} from '../../types'

import {
	TableAchievement,
	TTableAchievement
} from '../../../../shared/tables/TableAchievement'

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


type User {
  photoURL: String
  achievements: [String]
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

`

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
	topListeners?: Object[]
}
// type TopGenresRow = {
//   name: string,
//   playDurationMs: number,
// }

type TopArtistsRow = {
	artist: Artist
	playDurationMs: number
}

type PerspectiveTypes = 'personal' | 'group'
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

const perspectiveTopArtists = async (
	tableStat: TTableStat,
	primaryUid: string,
	primaryType: PerspectiveTypes,
	secondaryUid: string,
	secondaryType: PerspectiveTypes,
	periodType: PeriodType,
	periodCurrent: string,
	periodPrev?: string
): Promise<TopArtistStat[]> => {
	const artistsPrimary = await tableStat.getTopArtists({
		uid: primaryUid,
		periodType,
		periodValue: periodCurrent,
		Limit: 20
	})
	return await Promise.all(
		artistsPrimary.map(async ({ artist, playDurationMs }) => {
			const secondary = await tableStat.getArtistStat({
				uid: secondaryUid,
				artistId: artist.id,
				periodType,
				periodValue: periodCurrent
			})
			const personal =
				primaryType === 'personal'
					? playDurationMs / 3600000
					: secondary / 3600000
			const group =
				primaryType === 'group' ? playDurationMs / 3600000 : secondary / 3600000

			return {
				artist,
				personal,
				group
			}
		})
	)
}

const timescopeTopArtists = async (
	tableStat: TTableStat,
	uid: string,
	gid: string,
	periodType: PeriodType,
	periodCurrent: string,
	periodPrev?: string
): Promise<TimescopeTopArtists> => ({
	personal: await perspectiveTopArtists(
		tableStat,
		uid,
		'personal',
		'global',
		'group',
		periodType,
		periodCurrent,
		periodPrev
	),
	group: await perspectiveTopArtists(
		tableStat,
		'global',
		'group',
		uid,
		'personal',
		periodType,
		periodCurrent,
		periodPrev
	)
})

const topArtists = async (
	tableStat: TTableStat,
	tableAchievement: TTableAchievement,
	uid: string,
	gid: string,
	now: moment.Moment
) => {
	const { day: today, week: thisWeek, month: thisMonth } = tableStat.periodsFor(
		localizedISOString(now)
	)
	const { day: yest } = tableStat.periodsFor(
		localizedISOString(now.subtract(1, 'days'))
	)
	const { week: lastWeek } = tableStat.periodsFor(
		localizedISOString(now.subtract(1, 'days'))
	)
	const { month: lastMonth } = tableStat.periodsFor(
		localizedISOString(now.subtract(1, 'days'))
	)

	const dailyArtists: any = await timescopeTopArtists(
		tableStat,
		uid,
		gid,
		'day',
		today,
		yest
	).then(async res => {
		const { personal, group } = res
		console.log('TCL: personal', personal)
		await Promise.all(
			personal.map(async pArtistData => {
				const { artist } = pArtistData
				const firstKeys = keyMakerPlaceAndDay({
					perspective: gid,
					relationType: 'artist',
					periodType: 'day',
					periodValue: today,
					artistId: artist.id,
					achievementType: 'topListener',
					achievementValue: 'first'
				})
				const secondKeys = keyMakerPlaceAndDay({
					perspective: gid,
					relationType: 'artist',
					periodType: 'day',
					periodValue: today,
					artistId: artist.id,
					achievementType: 'topListener',
					achievementValue: 'second'
				})
				const thirdKeys = keyMakerPlaceAndDay({
					perspective: gid,
					relationType: 'artist',
					periodType: 'day',
					periodValue: today,
					artistId: artist.id,
					achievementType: 'topListener',
					achievementValue: 'third'
				})

				const keys = [firstKeys, secondKeys, thirdKeys]
				const topListeners = await Promise.all(
					keys.map(async (keyData: KeyData) => {
						const data = await tableAchievement.getArtistTopListeners(keyData)
						
						return data
					})
				)

				artist.topListeners = topListeners

				return pArtistData
			})
		)

		return {
			personal,
			group
		}
	})



	
	/**
	 *
	 * Weekly Enriched Top Artists w/Top Listeners
	 *
	 */
	
	
	const weeklyArtists = await timescopeTopArtists(
		tableStat,
		uid,
		gid,
		'week',
		thisWeek,
		lastWeek
	).then(async res => {
		const { personal, group } = res
		console.log('TCL: personal', personal)
		await Promise.all(
			personal.map(async pArtistData => {
				const { artist } = pArtistData
				const firstKeys = keyMakerPlaceAndDay({
					perspective: gid,
					relationType: 'artist',
					periodType: 'week',
					periodValue: thisWeek,
					artistId: artist.id,
					achievementType: 'topListener',
					achievementValue: 'first'
				})
				const secondKeys = keyMakerPlaceAndDay({
					perspective: gid,
					relationType: 'artist',
					periodType: 'week',
					periodValue: thisWeek,
					artistId: artist.id,
					achievementType: 'topListener',
					achievementValue: 'second'
				})
				const thirdKeys = keyMakerPlaceAndDay({
					perspective: gid,
					relationType: 'artist',
					periodType: 'week',
					periodValue: thisWeek,
					artistId: artist.id,
					achievementType: 'topListener',
					achievementValue: 'third'
				})

				const keys = [firstKeys, secondKeys, thirdKeys]
				const topListeners = await Promise.all(
					keys.map(async (keyData: KeyData) => {
						const data = await tableAchievement.getArtistTopListeners(keyData)
						
						return data
					})
				)

				artist.topListeners = topListeners

				return pArtistData
			})
		)

		return {
			personal,
			group
		}
	})

	
	/**
	 *
	 * Monthly Top Artists Enriched w/TopListeners
	 *
	 */
	
	

	const monthlyArtists = await timescopeTopArtists(
		tableStat,
		uid,
		gid,
		'month',
		thisMonth,
		lastMonth
	).then(async res => {
		const { personal, group } = res
		console.log('TCL: personal', personal)
		await Promise.all(
			personal.map(async pArtistData => {
				const { artist } = pArtistData
				const firstKeys = keyMakerPlaceAndDay({
					perspective: gid,
					relationType: 'artist',
					periodType: 'month',
					periodValue: thisMonth,
					artistId: artist.id,
					achievementType: 'topListener',
					achievementValue: 'first'
				})
				const secondKeys = keyMakerPlaceAndDay({
					perspective: gid,
					relationType: 'artist',
					periodType: 'month',
					periodValue: thisMonth,
					artistId: artist.id,
					achievementType: 'topListener',
					achievementValue: 'second'
				})
				const thirdKeys = keyMakerPlaceAndDay({
					perspective: gid,
					relationType: 'artist',
					periodType: 'month',
					periodValue: thisMonth,
					artistId: artist.id,
					achievementType: 'topListener',
					achievementValue: 'third'
				})

				const keys = [firstKeys, secondKeys, thirdKeys]
				const topListeners = await Promise.all(
					keys.map(async (keyData: KeyData) => {
						const data = await tableAchievement.getArtistTopListeners(keyData)
						
						return data
					})
				)

				artist.topListeners = topListeners

				return pArtistData
			})
		)

		return {
			personal,
			group
		}
	})

	
	/**
	 *
	 * LifeTime Top Artists w/Listeners
	 *
	 */
	
	

	const lifetimeArtists = await timescopeTopArtists(
		tableStat,
		uid,
		gid,
		'life',
		'life'
	).then(async res => {
		const { personal, group } = res
		console.log('TCL: personal', personal)
		await Promise.all(
			personal.map(async pArtistData => {
				const { artist } = pArtistData
				const firstKeys = keyMakerPlaceAndDay({
					perspective: gid,
					relationType: 'artist',
					periodType: 'life',
					periodValue: 'life',
					artistId: artist.id,
					achievementType: 'topListener',
					achievementValue: 'first'
				})
				const secondKeys = keyMakerPlaceAndDay({
					perspective: gid,
					relationType: 'artist',
					periodType: 'life',
					periodValue: 'life',
					artistId: artist.id,
					achievementType: 'topListener',
					achievementValue: 'second'
				})
				const thirdKeys = keyMakerPlaceAndDay({
					perspective: gid,
					relationType: 'artist',
					periodType: 'life',
					periodValue: 'life',
					artistId: artist.id,
					achievementType: 'topListener',
					achievementValue: 'third'
				})

				const keys = [firstKeys, secondKeys, thirdKeys]
				const topListeners = await Promise.all(
					keys.map(async (keyData: KeyData) => {
						const data = await tableAchievement.getArtistTopListeners(keyData)
						
						return data
					})
				)

				artist.topListeners = topListeners

				return pArtistData
			})
		)

		return {
			personal,
			group
		}
	})


	return {
		today: dailyArtists,
		thisWeek: weeklyArtists,
		thisMonth: monthlyArtists,
		lifetime: lifetimeArtists
	}
}

const insightsArtists = async (
	_,
	{ uid, gid },
	context
): Promise<InsightsArtistsResponse> => {
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

	const tableUser = TableUser(context.DYNAMO_ENDPOINT, context.TABLE_USER)
	const tableAchievement = TableAchievement(
		context.DYNAMO_ENDPOINT,
		context.TABLE_ACHIEVEMENT
	)
	const { valid, invalid } = await tableUser.getUser(uid)
	if (invalid) {
		throw new Error(`user info invalid for uid ${uid}`)
	}
	const { utcOffset }: any = valid
	const tableStat = TableStat(context.DYNAMO_ENDPOINT, context.TABLE_STAT)
	// @ts-ignore
	const now = localizedMoment(utcOffset, moment())
	const ret = await topArtists(tableStat, tableAchievement, uid, gid, now)

	console.log('ret', ret)
	return ret
}

const resolvers = {
	Query: {
		insightsArtists
	}
}

export const insightsArtistsSchema = makeExecutableSchema({
	typeDefs,
	resolvers
})

