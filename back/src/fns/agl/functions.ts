import { Artist, User } from '../graphql/types'
import {
	TTableAchievement,
	KeyData
} from '../../shared/tables/TableAchievement'
import { PeriodType } from '../../shared/tables/TableStat'

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
}
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
	recordKeys,
	achievementType,
	achievementValue,
	uid
}) => {
	const { pk, sk } = recordKeys

	return {
		pk: `${pk}#${achievementType}#${achievementValue}`,
		sk: `${sk}#${achievementType}#${achievementValue}`,
		fk: `#${achievementType}#${achievementValue}#${uid}`
	}
}

export const keyMaker = args => [...args].join('#')

export const indexToAchievementMap = {
	0: 'first',
	1: 'second',
	2: 'third'
}

export const makeRecordKeys = Keys => extractKeys(Keys)

export const getDailyTopAchievers = async (
	dailyTops: UserTopRecordArtistStat[],
	artistInfo: Artist,
	tableAchievement: TTableAchievement,
	lastUpdated: string
) => {
	const { day, week, month, life } = tableAchievement.periodsFor(lastUpdated)

	const topListenerDailyParams = {
		perspective: 'global',
		relationType: 'artist',
		periodType: 'day',
		periodValue: day,
		artistId: artistInfo.id
	}
	const topThree = await topThreeListeners({
		...topListenerDailyParams,
		tableAchievement
	})
	console.log('TCL: daily topThree', topThree)

	artistInfo.topListeners = topThree

	const achieverData = dailyTops.length
		? await Promise.all(
				dailyTops.map(async (daily, index) => {
					console.log('TCL: handleRecord -> index', index)
					if (index <= 2) {
						const { recordKeys, user, dayData } = daily
						const achievementType = 'topListener'
						const achievementValue = indexToAchievementMap[index]
						const { uid } = user
						const total = dayData

						console.log('TCL: handleRecord -> dayData', dayData)
						const keyData = makeKeys({
							recordKeys,
							achievementType,
							achievementValue,
							uid
						})
						const newAchievement = await tableAchievement.createOrModifyAchievement(
							{
								keyData,
								total,
								lastUpdated,
								user,
								artist: artistInfo
							}
						)
						return newAchievement
					}
				})
		  )
		: null

	return achieverData
}

/**
 *
 * Weekly Achievement Creation
 *
 */

export const getWeeklyTopAchievers = async (
	weeklyTops: UserTopRecordArtistStat[],
	artistInfo: Artist,
	tableAchievement: TTableAchievement,
	lastUpdated: string
) => {
	const { day, week, month, life } = tableAchievement.periodsFor(lastUpdated)

	const topListenerWeekParams = {
		perspective: 'global',
		relationType: 'artist',
		periodType: 'week',
		periodValue: week,
		artistId: artistInfo.id
	}

	const topThree = await topThreeListeners({
		...topListenerWeekParams,
		tableAchievement
	})

	console.log('TCL: topThree', topThree)

	artistInfo.topListeners = topThree

	const achieverData = weeklyTops.length
		? await Promise.all(
				weeklyTops.map(async (weekly, index) => {
					console.log('TCL: handleRecord -> index', index)
					if (index <= 2) {
						const { recordKeys, user, weekData } = weekly
						const achievementType = 'topListener'
						const achievementValue = indexToAchievementMap[index]
						const { uid } = user
						const total = weekData

						console.log('TCL: handleRecord -> weekData', weekData)

						const keyData = makeKeys({
							recordKeys,
							achievementType,
							achievementValue,
							uid
						})

						const newAchievement = await tableAchievement.createOrModifyAchievement(
							{
								keyData,
								total,
								lastUpdated,
								user,
								artist: artistInfo
							}
						)
						return newAchievement
					}
				})
		  )
		: null

	return achieverData
}

/**
 *
 * cc: Monthly Achievement Creation
 *
 */

export const getMonthlyTopAchievers = async (
	monthlyTops: UserTopRecordArtistStat[],
	artistInfo: Artist,
	tableAchievement: TTableAchievement,
	lastUpdated: string
) => {
	const { day, week, month, life } = tableAchievement.periodsFor(lastUpdated)

	const topListenerMonthParams = {
		perspective: 'global',
		relationType: 'artist',
		periodType: 'month',
		periodValue: month,
		artistId: artistInfo.id
	}

	const topThree = await topThreeListeners({
		...topListenerMonthParams,
		tableAchievement
	})

	console.log('TCL: topThree', topThree)

	artistInfo.topListeners = topThree

	const achieverData = monthlyTops.length
		? await Promise.all(
				monthlyTops.map(async (monthly, index) => {
					console.log('TCL: handleRecord -> index', index)
					if (index <= 2) {
						const { recordKeys, user, monthData } = monthly
						const achievementType = 'topListener'
						const achievementValue = indexToAchievementMap[index]
						const { uid } = user
						const total = monthData

						console.log('TCL: handleRecord -> monthData', monthData)

						const keyData = makeKeys({
							recordKeys,
							achievementType,
							achievementValue,
							uid
						})

						const newAchievement = await tableAchievement.createOrModifyAchievement(
							{
								keyData,
								total,
								lastUpdated,
								user,
								artist: artistInfo
							}
						)
						return newAchievement
					}
				})
		  )
		: null

	return achieverData
}

export const getLifetimeTopAchievers = async (
	lifetimeTops: UserTopRecordArtistStat[],
	artistInfo: Artist,
	tableAchievement: TTableAchievement,
	lastUpdated: string
) => {
	const { day, week, month, life } = tableAchievement.periodsFor(lastUpdated)

	const topListenerLifeParams = {
		perspective: 'global',
		relationType: 'artist',
		periodType: 'life',
		periodValue: life,
		artistId: artistInfo.id
	}

	const topThree = await topThreeListeners({
		...topListenerLifeParams,
		tableAchievement
	})

	console.log('TCL: topThree', topThree)

	artistInfo.topListeners = topThree

	const achieverData = lifetimeTops.length
		? await Promise.all(
				lifetimeTops.map(async (lifetime, index) => {
					if (index <= 2) {
						const { recordKeys, user, lifeData } = lifetime
						const achievementType = 'topListener'
						const achievementValue = indexToAchievementMap[index]
						const { uid } = user
						const total = lifeData

						const keyData = makeKeys({
							recordKeys,
							achievementType,
							achievementValue,
							uid
						})

						const newAchievement = await tableAchievement.createOrModifyAchievement(
							{
								keyData,
								total,
								lastUpdated,
								user,
								artist: artistInfo
							}
						)
						return newAchievement
					}
				})
		  )
		: null
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
    //   const topListeners = {
	// 			first: tableAchievement.getArtistTopListeners(firstKeys),
	// 			second: tableAchievement.getArtistTopListeners(secondKeys),
	// 			third: tableAchievement.getArtistTopListeners(thirdKeys)
	// 		}
	console.log('TCL: topListeners', topListeners)
	return topListeners
}
