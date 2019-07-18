import * as R from 'ramda';
import { makeExecutableSchema } from "graphql-tools";
import { TableStat, TTableStat, PeriodType } from "../../../../shared/tables/TableStat";
import * as moment from "moment"
import { TableUser } from "../../../../shared/tables/TableUser";
import { verifyEnv } from "../../../../shared/env";
import { InsightsDashResponseResolvers, InsightsDashResponse, TimescopeTops, PerspectiveTops, InsightsArtistsResponse, TimescopeTopArtists, TopArtistStat } from "../../types";
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
  id: string,
  name: string,
  images: Image[],
  external_urls: SpotifyUrl
  genres: string[]
  topListeners?: Object []
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

const perspectiveTopArtists = async (
	tableStat: TTableStat,
	tableAchievement: TTableAchievement,
	primaryUid: string,
	primaryType: PerspectiveTypes,
	secondaryUid: string,
	secondaryType: PerspectiveTypes,
	periodType: PeriodType,
	periodCurrent: string,
  periodPrev?: string,
  now?: moment.Moment
): Promise<TopArtistStat[]> => {
	const artistsPrimary = await tableStat.getTopArtists({
		uid: primaryUid,
		periodType,
		periodValue: periodCurrent,
		Limit: 20
  })
  // artists
	const artists: any = await Promise.all(
		artistsPrimary.map(async ({ artist, playDurationMs }) => {
			console.log('TCL: playDurationMs', playDurationMs)
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
			}
			const second = await tableAchievement.getArtistTopListeners({
				artistId: artist.id,
				achievementType: 'topListener',
				achievementValue: 'second',
				periodType: 'life',
				periodValue: 'life',
				currentTime: now
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
				currentTime: now
			})

			console.log('TCL: perspectiveTopArtists -> third', third)
			if (third) {
				enrichedArtist.topListeners.push(third)
			}

			console.log(
				'TCL: perspectiveTopArtists -> enrichedArtist.topListeners',
				enrichedArtist.topListeners
			)

			console.log(enrichedArtist)

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
				primaryType === 'group'
					? playDurationMs / 3600000
					: secondary / 3600000

			return {
				artist: enrichedArtist,
				personal,
				group
			}
		})
  )
  return artists
}

const timescopeTopArtists = async (
	tableStat: TTableStat,
	tableAchievement: TTableAchievement,
	uid: string,
	gid: string,
	periodType: PeriodType,
	periodCurrent: string,
  periodPrev?: string,
  now?: moment.Moment
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
    periodPrev,
    now
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
    periodPrev,
    now
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

	return {
		today: await timescopeTopArtists(tableStat, tableAchievement, uid, gid, 'day', today, yest, now),
		thisWeek: await timescopeTopArtists(
			tableStat, tableAchievement,
			uid,
			gid,
			'week',
			thisWeek,
			lastWeek, now
		),
		thisMonth: await timescopeTopArtists(
			tableStat, tableAchievement,
			uid,
			gid,
			'month',
			thisMonth,
			lastMonth, now
		),
		lifetime: await timescopeTopArtists(tableStat, tableAchievement, uid, gid, 'life', 'life')
	}
}
const insightsArtists = async (_, {uid, gid}, context): Promise<InsightsArtistsResponse> => {
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
  if (invalid) { throw new Error(`user info invalid for uid ${uid}`) }
  const { utcOffset } = valid

  const tableStat = TableStat(context.DYNAMO_ENDPOINT, context.TABLE_STAT)

  const now = localizedMoment(utcOffset, moment())

  const ret = await topArtists(tableStat, tableAchievement, uid, gid, now)
  console.log('ret', ret)
  return ret
}

const resolvers = {
  Query: {
    insightsArtists,
  }
}

export const insightsArtistsSchema = makeExecutableSchema({typeDefs, resolvers})