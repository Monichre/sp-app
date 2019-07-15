// import * as R from 'ramda'
// import { makeExecutableSchema } from 'graphql-tools'
// import {
// 	TableStat,
// 	TTableStat,
// 	PeriodType
// } from '../../shared/tables/TableStat'
// import moment = require('moment')
// import { TableUser } from '../../shared/tables/TableUser'
// import { verifyEnv } from '../../shared/env'
// import {
// 	InsightsArtistsResponse,
// 	TimescopeTopArtists,
// 	TopArtistStat
// } from '../graphql/types'


// type PerspectiveTypes = 'personal' | 'group'

// const perspectiveTopArtists = async (tableStat: TTableStat, primaryUid: string, primaryType: PerspectiveTypes, secondaryUid: string, secondaryType: PerspectiveTypes, periodType: PeriodType, periodCurrent: string, periodPrev?: string): Promise<TopArtistStat[]> => {
//   const artistsPrimary = await tableStat.getTopArtists({uid: primaryUid, periodType, periodValue: periodCurrent, Limit: 20})
//   const artists = await Promise.all(artistsPrimary.map(async ({artist, playDurationMs}) => {
//     const secondary = await tableStat.getArtistStat({uid: secondaryUid, artistId: artist.id, periodType, periodValue: periodCurrent})
//     const personal = primaryType === 'personal' ? playDurationMs / 3600000 : secondary / 3600000
//     const group = primaryType === 'group' ? playDurationMs / 3600000 : secondary / 3600000
//     return {
//       artist,
//       personal,
//       group,
//     }
//   }))

//   return artists
// }


// const localizedMoment = (utcOffset: number, m: moment.Moment) =>
// 	moment.utc(m).utcOffset(utcOffset, false)

// const localizedISOString = (m: moment.Moment) => m.toISOString(true)
// const timescopeTopArtists = async (
// 	tableStat: TTableStat,
// 	uid: string,
// 	gid: string,
// 	periodType: PeriodType,
// 	periodCurrent: string,
// 	periodPrev?: string
// ): Promise<TimescopeTopArtists> => ({
// 	personal: await perspectiveTopArtists(
// 		tableStat,
// 		uid,
// 		'personal',
// 		'global',
// 		'group',
// 		periodType,
// 		periodCurrent,
// 		periodPrev
// 	),
// 	group: await perspectiveTopArtists(
// 		tableStat,
// 		'global',
// 		'group',
// 		uid,
// 		'personal',
// 		periodType,
// 		periodCurrent,
// 		periodPrev
// 	)
// })


// const topArtists = async (
// 	tableStat: TTableStat,
// 	uid: string,
// 	gid: string,
// 	now: moment.Moment
// ) => {
// 	const { day: today, week: thisWeek, month: thisMonth } = tableStat.periodsFor(
// 		localizedISOString(now)
// 	)
// 	const { day: yest } = tableStat.periodsFor(
// 		localizedISOString(now.subtract(1, 'days'))
// 	)
// 	const { week: lastWeek } = tableStat.periodsFor(
// 		localizedISOString(now.subtract(1, 'days'))
// 	)
// 	const { month: lastMonth } = tableStat.periodsFor(
// 		localizedISOString(now.subtract(1, 'days'))
// 	)

// 	return {
// 		today: await timescopeTopArtists(tableStat, uid, gid, 'day', today, yest),
// 		thisWeek: await timescopeTopArtists(
// 			tableStat,
// 			uid,
// 			gid,
// 			'week',
// 			thisWeek,
// 			lastWeek
// 		),
// 		thisMonth: await timescopeTopArtists(
// 			tableStat,
// 			uid,
// 			gid,
// 			'month',
// 			thisMonth,
// 			lastMonth
// 		),
// 		lifetime: await timescopeTopArtists(tableStat, uid, gid, 'life', 'life')
// 	}
// }
// const insightsArtists = async (
// 	_,
// 	{ uid, gid },
// 	context
// ): Promise<InsightsArtistsResponse> => {
// 	const log = context.log
// 	log.info('called by', { uid })
// 	const env = verifyEnv(
// 		{
// 			DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
// 			TABLE_STAT: process.env.TABLE_STAT
// 		},
// 		log
// 	)

// 	const tableUser = TableUser(process.env.DYNAMO_ENDPOINT, process.env.TABLE_USER)
// 	const { valid, invalid } = await tableUser.getUser(uid)
// 	if (invalid) {
// 		throw new Error(`user info invalid for uid ${uid}`)
// 	}
// 	const { utcOffset } = valid

// 	const tableStat = TableStat(context.DYNAMO_ENDPOINT, context.TABLE_STAT)

// 	const now = localizedMoment(utcOffset, moment())

// 	const ret = await topArtists(tableStat, uid, gid, now)
// 	console.log('ret', ret)
// 	return ret
// }
