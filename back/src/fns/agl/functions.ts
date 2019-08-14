import { Artist, User } from '../graphql/types'
import { TTableAchievement } from '../../shared/tables/TableAchievement'

type UserTopRecordArtistStat = {
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
) =>
	dailyTops.length
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
) =>
	weeklyTops.length
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

/**
 *
 * Weekly Achievement Creation
 *
 */

export const getMonthlyTopAchievers = async (
	monthlyTops: UserTopRecordArtistStat[],
	artistInfo: Artist,
	tableAchievement: TTableAchievement,
	lastUpdated: string
) =>
	monthlyTops.length
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

export const getLifetimeTopAchievers = async (
	lifetimeTops: UserTopRecordArtistStat[],
	artistInfo: Artist,
	tableAchievement: TTableAchievement,
	lastUpdated: string
) =>
	lifetimeTops.length
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
