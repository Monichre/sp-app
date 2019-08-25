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

import {

	InsightsArtistsResponse,
	TimescopeTopArtists,
	TopArtistStat,
	QueryResolvers,
} from '../../types'

import {
	TableAchievement
} from '../../../../shared/tables/TableAchievement'
import { TTableAchievement } from '../../../../shared/SharedTypes';

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
  fk: String
  lastUpdated: String
  total: Float
  user: User
}


type TopListenerDataPeriod {
  first: TopListener
  second: TopListener
  third: TopListener
}

type TopListenerData {
  day: TopListenerDataPeriod
  week: TopListenerDataPeriod
  month: TopListenerDataPeriod
  life: TopListenerDataPeriod
}



type Artist {
  id: String!
  name: String!
  images: [Image!]!
  external_urls: SpotifyUrl!
  genres: [String!]!
  topListeners: TopListenerData
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
export type TopListenerData = {
  day: {
    first: any
    second: any
    third: any

  }
  week: {
    first: any
    second: any
    third: any

  }
  month: {
    first: any
    second: any
    third: any

  }
  life: {
    first: any
    second: any
    third: any

  }
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
	artist: Artist
	playDurationMs: number
}

type PerspectiveTypes = 'personal' | 'group'
type EnrichedKeyMakerParams = {
	relationType: 'artist'
	periodType: PeriodType
	periodValue: string
	artistId: string
	achievementType: 'topListener'
	achievementValue: 'first' | 'second' | 'third'
	uid?: string | null
}
const keyMaker = (args: any) => [...args].join('#')
const keyMakerPlaceAndDay = ({
	relationType,
	periodType,
	periodValue,
	artistId,
	achievementType,
	achievementValue,
	uid=null
}: EnrichedKeyMakerParams) => {

	
	const pk = keyMaker([
		achievementType,
		achievementValue,
		periodType,
		periodValue
	])
	const sk = keyMaker([
		artistId,
		periodType,
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
	tableAchievement: TTableAchievement,
	primaryUid: string,
	primaryType: PerspectiveTypes,
	secondaryUid: string,
	secondaryType: PerspectiveTypes,
	periodType: PeriodType,
	periodCurrent: string,
	periodPrev?: string
): Promise<TopArtistStat[]> => {
	const artistsPrimary = await tableStat.getTopArtists({
		tableAchievement,
		uid: primaryUid,
		periodType,
		periodValue: periodCurrent,
		Limit: 20
	})
	// @ts-ignore
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
	tableAchievement: TTableAchievement,
	uid: string,
	gid: string,
	periodType: PeriodType,
	periodCurrent: string,
	periodPrev?: string
): Promise<TimescopeTopArtists> => ({
	personal: await perspectiveTopArtists(
		tableStat,
		tableAchievement,
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
		tableAchievement,
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
		tableAchievement,
		uid,
		gid,
		'day',
		today,
		yest,
		
	).then(async res => {
		const { personal, group } = res

	
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
		tableAchievement,
		uid,
		gid,
		'week',
		thisWeek,
		lastWeek,
	).then(async res => {
		const { personal, group } = res

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
		tableAchievement,
		uid,
		gid,
		'month',
		thisMonth,
		lastMonth,
	).then(async res => {
		const { personal, group } = res

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
		tableAchievement,
		uid,
		gid,
		'life',
		'life'
	).then(async res => {
		const { personal, group } = res

	
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

// @ts-ignore
const insightsArtists = async (_, { uid, gid }, context): Promise<InsightsArtistsResponse> => {
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

