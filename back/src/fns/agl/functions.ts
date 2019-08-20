import { Artist, User } from '../graphql/types'
import {
	TTableAchievement,
	KeyData
} from '../../shared/tables/TableAchievement'
import { PeriodType } from '../../shared/tables/TableStat'
import * as moment from 'moment'
import * as _ from 'lodash'

export type EnrichedKeyMakerParams = {
	perspective: string
	relationType: 'artist'
	periodType: PeriodType
	periodValue: string
	artistId: string
	achievementType: 'topListener'
	achievementValue: 'first' | 'second' | 'third'
}

export type UserTopRecordArtistStat = {
	recordKeys: {
		pk: string
		sk: string
		fk: string
	}
	user: User
	dayData: number
	weekData: number
	monthData: number
	lifeData: number
	lastUpdated: string
}

export const localizedMoment = (utcOffset: number, m: moment.Moment) =>
	moment.utc(m).utcOffset(utcOffset, false)

export const localizedISOString = (m: moment.Moment) => m.toISOString(true)

export const extractKeys = ({ pk, sk }) => ({
	pk: pk.S,
	sk: sk.S
})

export const extractPeriodTypeAndValue = ({ pk, sk }) => {
	const split = pk.split('#')
	const end = split.length - 1

	const periodType = split[end - 1]
	const periodValue = split[end]

	return {
		periodType,
		periodValue
	}
}

export const makeKeys = ({
	artistId,
	recordKeys,
	achievementType,
	achievementValue,
	uid
}) => {
	const { pk, sk } = recordKeys
	const {periodType, periodValue} = extractPeriodTypeAndValue({pk, sk})

	return {
		pk: `${artistId}#${periodType}#${periodValue}#${achievementType}#${achievementValue}`,
		sk: `${artistId}#${periodType}#${periodValue}#user#${uid}#${achievementValue}`,
		fk: `${uid}#${achievementType}#${achievementValue}`
	}
}

export const keyMaker = args => [...args].join('#')

export const indexToAchievementMap = {
	0: 'first',
	1: 'second',
	2: 'third'
}

export const makeRecordKeys = Keys => extractKeys(Keys)

export const bulkRecordUserAchievements = async (
	usersWithStats: any[],
	artistInfo: Artist,
	recordKeys: any,
	tableAchievement: TTableAchievement
) => {
	const achieverData = await Promise.all(
		usersWithStats.map(async (userData, index) => {
			console.log('TCL: userData', userData)
			const achievementType = 'topListener'
			const achievementValue = indexToAchievementMap[index]
			const { user, stat: total, lastUpdated } = userData
			const { uid } = user

			const keyData = makeKeys({
				artistId:artistInfo,
				recordKeys,
				achievementType,
				achievementValue,
				uid
			})
			const newAchievement = await tableAchievement.createOrModifyAchievement({
				keyData,
				total,
				lastUpdated,
				user,
				artist: artistInfo
			})
			console.log('TCL: newAchievement', newAchievement)
			return newAchievement
		})
	)
	console.log('TCL: achieverData', achieverData)

	return achieverData
}

export const keyMakerPlaceAndDay = ({
	perspective,
	relationType,
	periodType,
	periodValue,
	artistId,
	achievementType,
	achievementValue
}: EnrichedKeyMakerParams) => {
		// pk: `${artistId}#${periodType}#${periodValue}#${achievementType}#${achievementValue}`,
		// sk: `${artistId}#${periodType}#${periodValue}#user#${uid}#${achievementValue}`,
		// fk: `${uid}#${achievementType}#${achievementValue}`
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

export const topThreeListeners = async ({
	perspective,
	relationType,
	periodType,
	periodValue,
	artistId,
	tableAchievement
}) => {
	const firstKeys: any = keyMakerPlaceAndDay({
		perspective,
		relationType,
		periodType,
		periodValue,
		artistId,
		achievementType: 'topListener',
		achievementValue: 'first'
	})
	const secondKeys = keyMakerPlaceAndDay({
		perspective,
		relationType,
		periodType,
		periodValue,
		artistId,
		achievementType: 'topListener',
		achievementValue: 'second'
	})
	const thirdKeys = keyMakerPlaceAndDay({
		perspective,
		relationType,
		periodType,
		periodValue,
		artistId,
		achievementType: 'topListener',
		achievementValue: 'third'
	})

	const keys = [firstKeys, secondKeys, thirdKeys]
	const topListeners = await Promise.all(
		keys.map(
			async (keyData: KeyData) =>
				await tableAchievement.getArtistTopListeners(keyData)
		)
	)

	return topListeners
}

export const organizeUserStatsByPeriod = async (
	valids: any,
	artistInfo: any,
	ApproximateCreationDateTime,
	tableStat,
	tableAchievement
) => {
	const { day, week, month, life } = tableAchievement.periodsFor(
		ApproximateCreationDateTime
	)

	const byDay = await Promise.all(
		valids
			.map(async (user: any) => {
				const { utcOffset }: any = user
				const lastUpdated = localizedMoment(utcOffset, moment()).format(
					'MMMM Do YYYY, h:mm:ss a'
				)

				const stat = await tableStat.getArtistStat({
					uid: user.uid,
					artistId: artistInfo.id,
					periodType: 'day',
					periodValue: day
				})
				return {
					user,
					lastUpdated,
					stat
				}
			})
	).then(res => {
		console.log('res', res)
		const filtered = res.filter((item: any) => item.stat && item.stat > 0)

		return filtered && filtered.length ? _.sortBy(filtered, d => d.stat).reverse() : null
	})
		

	const byWeek = await Promise.all(
		valids
			.map(async (user: any) => {
				const { utcOffset }: any = user
				const lastUpdated = localizedMoment(utcOffset, moment()).format(
					'MMMM Do YYYY, h:mm:ss a'
				)

				const stat = await tableStat.getArtistStat({
					uid: user.uid,
					artistId: artistInfo.id,
					periodType: 'week',
					periodValue: week
				})
				console.log('TCL: stat', stat)

				return {
					user,
					lastUpdated,
					stat
				}
			})
	).then(res => {
		console.log('res', res)
		const filtered = res.filter((item: any) => item.stat && item.stat > 0)
		console.log('filtered', filtered)

		return filtered && filtered.length ? _.sortBy(filtered, d => d.stat).reverse() : null
	})
		

	const byMonth = await Promise.all(
		valids
			.map(async (user: any) => {
				const { utcOffset }: any = user
				const lastUpdated = localizedMoment(utcOffset, moment()).format(
					'MMMM Do YYYY, h:mm:ss a'
				)

				const stat = await tableStat.getArtistStat({
					uid: user.uid,
					artistId: artistInfo.id,
					periodType: 'month',
					periodValue: month
				})
				return {
					user,
					lastUpdated,
					stat
				}
			})
		
	).then(res => {
		console.log('res', res)
		const filtered = res.filter((item: any) => item.stat && item.stat > 0)

		return filtered && filtered.length ? _.sortBy(filtered, d => d.stat).reverse() : null
	})
		

	const byLifetime = await Promise.all(
		valids
			.map(async (user: any) => {
				const { utcOffset }: any = user
				const lastUpdated = localizedMoment(utcOffset, moment()).format(
					'MMMM Do YYYY, h:mm:ss a'
				)

				const stat = await tableStat.getArtistStat({
					uid: user.uid,
					artistId: artistInfo.id,
					periodType: 'life',
					periodValue: life
				})

				const data = {
					user,
					lastUpdated,
					stat
				}
				return data
			})
	).then(res => {
		console.log('res', res)
		const filtered = res.filter((item: any) => item.stat && item.stat > 0)

		return filtered && filtered.length ? _.sortBy(filtered, d => d.stat).reverse() : null
	})
		

	return {
		byDay,
		byWeek,
		byMonth,
		byLifetime
	}
}
