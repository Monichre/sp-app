import { useGetUserAchievements } from '../../../types'
import { suspensefulHook } from '../../../lib/suspensefulHook'
import moment from 'moment';
import * as _ from 'lodash'
import { TopArtistStat } from '../../../../../back/src/fns/graphql/types';
import { AchievementValue } from '../../../../../back/src/shared/SharedTypes';


export type AchievementPeriodType = 'week' | 'month' | 'life'
export type TopArtistsByPeriodType = {
	week: TopArtistStat[]
	month: TopArtistStat[]
	life: TopArtistStat[]
}
export type AchievementMetaData = {
	artistData: TopArtistStat
	achievement: object
}

export type UserAchievementPeriodMap = {
	week?: AchievementMetaData[] | null
	month?: AchievementMetaData[] | null
	life?: AchievementMetaData[] | null
}

// @ts-ignore
const day = moment().format('YYYY-MM-DD')
// @ts-ignore
const week = `${moment().year()}-${moment().week()}`
// @ts-ignore
const month = `${moment().year()}-${moment().month()}`

export const getAchievementTypes = (userId: any) => ({
	day: {
		first: {
			pk: `topListener#first#day#${day}`,
			fk: `${userId}#topListener#first`
		},
		second: {
			pk: `topListener#second#day#${day}`,
			fk: `${userId}#topListener#second`
		},
		third: {
			pk: `topListener#third#day#${day}`,
			fk: `${userId}#topListener#third`
		}
	},
	week: {
		first: {
			pk: `topListener#first#week#${week}`,
			fk: `${userId}#topListener#first`
		},
		second: {
			pk: `topListener#second#week#${week}`,
			fk: `${userId}#topListener#second`
		},
		third: {
			pk: `topListener#third#week#${week}`,
			fk: `${userId}#topListener#third`
		}
	},
	month: {
		first: {
			pk: `topListener#first#month#${month}`,
			fk: `${userId}#topListener#first`
		},
		second: {
			pk: `topListener#second#month#${month}`,
			fk: `${userId}#topListener#second`
		},
		third: {
			pk: `topListener#third#month#${month}`,
			fk: `${userId}#topListener#third`
		}
	},
	life: {
		first: {
			pk: `topListener#first#life#life`,
			fk: `${userId}#topListener#first`
		},
		second: {
			pk: `topListener#second#life#life`,
			fk: `${userId}#topListener#second`
		},
		third: {
			pk: `topListener#third#life#life`,
			fk: `${userId}#topListener#third`
		}
	}
})



export const handleDiff = (periodOne: any, periodTwo: any) =>
	_.differenceWith(periodOne, periodTwo, _.isEqual).length
		? {
			status: true,
			items: _.differenceWith(periodOne, periodTwo, _.isEqual),
			original: {
				periodOne,
				periodTwo
			}
		}
		: {
			status: false,
			items: null,
			original: null
		}



export const comparePersonalAndGroupScore = (personal: number, group: number) => ({
	status: personal >= group,
	total: personal
})

const discoveredAndFormatAchievements = (topArtistsByPeriod: TopArtistsByPeriodType, userId: string, period: AchievementPeriodType) => {

	return topArtistsByPeriod[period].filter((artistData: any) => {
		const { personal, group, artist } = artistData
		const { status } = comparePersonalAndGroupScore(personal, group)
		const isTopListener = !artist.topListeners[period].first && status
        

		return isTopListener
	}).map((artistData: any) => {
		const { personal, group, artist } = artistData
		const { total } = comparePersonalAndGroupScore(personal, group)

		const achievement = {
			userId: userId,
			total,
			pk: `topListener#first#artist#${period}#${period === 'month' ? moment().month() : period === 'week' ? moment().week() : 'life'}`,
			lastUpdated: moment().format('MMMM Do YYYY, h:mm:ss a')
		}
		return {
			artistData,
			achievement

		}
	})
}



const determinePossibleAchievements = (achievements: any = {}, topArtistsByPeriod: TopArtistsByPeriodType, userId: string) => {
	const existingAchievements: any = Object.assign({}, achievements)

	for (let period in existingAchievements) {
		const existing = existingAchievements[period]
        console.log('TCL: determinePossibleAchievements -> existing', existing)
		const derived: any = discoveredAndFormatAchievements(topArtistsByPeriod, userId, period as AchievementPeriodType)
		console.log('TCL: determinePossibleAchievements -> derived', derived)
		const merged = (existing && derived) ? _.union(derived, existing) : !existing ? derived : null
		existingAchievements[period] = merged

		return {existingAchievements}
	}
}

export const parseAchievementsByPeriod = (usersTopArtistByPeriodData: any, userId: string) => {
	const { lifetime, thisMonth, thisWeek, today } = usersTopArtistByPeriodData
	// @ts-ignore
	const weeklyArtists = [...new Set([...today.personal.artists, ...thisWeek.personal.artists])]
	const topArtistsByPeriod: any = {
		week: weeklyArtists,
		month: thisMonth.personal.artists,
		life: lifetime.personal.artists
	}

	const achievements: any = {
		week: null,
		month: null,
		life: null
	}

	for (let period in topArtistsByPeriod) {
		const p = period === 'day' ? 'week' : period

		achievements[p] = topArtistsByPeriod[p].filter((artistData: any) => {

			if (
				artistData.artist.topListeners[p] &&
				artistData.artist.topListeners[p].first
			) {
				if (artistData.artist.topListeners[p].first.user.uid === userId) {
					return true
				}
			}
		})
			.map((artistData: any) => ({
				artistData,
				achievement: artistData.artist.topListeners[p].first
			}))
		
		if (!achievements[p].length) {
			achievements[p] = null
		}
	}

	console.log('TCL: parseAchievementsByPeriod -> achievements', achievements)

	const { existingAchievements }: any = determinePossibleAchievements(achievements, topArtistsByPeriod, userId)
    console.log('TCL: parseAchievementsByPeriod -> existingAchievements', existingAchievements)


	return {
		achievements: existingAchievements
	}
}



export const getAchievementHistory = (userId: any) => {
	const { day, week, month, life } = getAchievementTypes(userId)

	const lifeTimeAchievementData: any = suspensefulHook(
		useGetUserAchievements({
			variables: { pk: life.first.pk, fk: life.first.fk },
			suspend: true,
			pollInterval: 15000
		})
	)

	const {
		getUserAchievements: lifetimeAchievements
	}: any = lifeTimeAchievementData

	const monthlyAchievementData: any = suspensefulHook(
		useGetUserAchievements({
			variables: { pk: week.first.pk, fk: week.first.fk },
			suspend: true,
			pollInterval: 15000
		})
	)

	const {
		getUserAchievements: monthlyAchievements
	}: any = monthlyAchievementData

	const weeklyAchievementData: any = suspensefulHook(
		useGetUserAchievements({
			variables: { pk: week.first.pk, fk: week.first.fk },
			suspend: true,
			pollInterval: 15000
		})
	)

	const { getUserAchievements: weeklyAchievements }: any = weeklyAchievementData

	const dailyAchievementData: any = suspensefulHook(
		useGetUserAchievements({
			variables: { pk: week.first.pk, fk: week.first.fk },
			suspend: true,
			pollInterval: 15000
		})
	)

	const { getUserAchievements: dailyAchievements }: any = dailyAchievementData

	return {
		dailyAchievements,
		weeklyAchievements,
		monthlyAchievements,
		lifetimeAchievements,
		diffAchievementsByPeriod: {
			dayAndWeekDiff: handleDiff(dailyAchievements, weeklyAchievements),
			weekAndMonthDiff: handleDiff(weeklyAchievements, monthlyAchievements),
			monthAndLifeDiff: handleDiff(monthlyAchievements, lifetimeAchievements)
		}
	}
}

export const diffAchievementsByPeriod = (userId: any) => {
	const {
		dailyAchievements,
		weeklyAchievements,
		monthlyAchievements,
		lifetimeAchievements
	} = getAchievementHistory(userId)

	return {
		dayAndWeekDiff: handleDiff(dailyAchievements, weeklyAchievements),
		weekAndMonthDiff: handleDiff(weeklyAchievements, monthlyAchievements),
		monthAndLifeDiff: handleDiff(monthlyAchievements, lifetimeAchievements)
	}
}
