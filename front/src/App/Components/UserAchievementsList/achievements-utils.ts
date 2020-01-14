import { useGetUserAchievements } from '../../../types'
import { suspensefulHook } from '../../../lib/suspensefulHook'
import moment from 'moment';
import * as _ from 'lodash'
import { TopArtistStat } from '../../../../../back/src/fns/graphql/types';
import { AchievementValue } from '../../../../../back/src/shared/SharedTypes';

const _flatten: any = (o: any) => {
	return [].concat(...Object.keys(o)
		.map(k =>
			typeof o[k] === 'object' ?
				_flatten(o[k]) :
				({ [k]: o[k] })
		)
	);
}

const flattenObj = (obj: any) => Object.assign({}, ..._flatten(obj))

export const determineAchievementValueFromPK = ({ pk }: any) => pk.includes('#first') ? 'first' : pk.includes('#second') ? 'second' : 'third'



export type AchievementPeriodType = 'week' | 'month' | 'life'
export type TopArtistsByPeriodType = {
	week: TopArtistStat[]
	month: TopArtistStat[]
	life: TopArtistStat[]
}
export type AchievementMetaData = {
	artistData: TopArtistStat
	achievement: {
		formattedTotal: string
		lastUpdated: string
		pk: string
		total: number
		uk: string
		userId?: string
	}
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


/*=============================================
	=            NOTES ON KEYS            =

	ak: AchievementType#AchievementValue#RelationType#RelationTypeId#PeriodType#PeriodValue. Ex: topListener#first#artist#4c2Fb5kfVRzodXZvitxnWk#month#2019-08

	pk: AchievementType#AchievementValue#RelationType#PeriodType#PeriodValue. Ex: topListener#first#artist#month#2019-08

	uk: UserId#AchievementType#AchievementValue#RelationType#PeriodType#PeriodValue. Ex: spotify:124053034#topListener#first#artist#month#2019-08

	auk: ArtistId#PeriodType#PeriodValue#RelationType(User)#RelationTypeId. Ex: 4c2Fb5kfVRzodXZvitxnWk#month#2019-08#user#spotify:124053034
	

=============================================*/

export const getAchievementTypes = (userId: any, perspective: 'global' | 'personal' = 'global') => ({
	day: {
		first: {

			pk: `${perspective}#topListener#first#artist#day#${day}`,
			uk: `${userId}#topListener#first#artist#day#${day}`
		},
		second: {
			pk: `${perspective}#topListener#second#artist#day#${day}`,
			uk: `${userId}#topListener#second#artist#day#${day}`
		},
		third: {
			pk: `${perspective}#topListener#third#artist#day#${day}`,
			uk: `${userId}#topListener#third#artist#day#${day}`
		}
	},
	week: {
		first: {
			pk: `${perspective}#topListener#first#artist#week#${week}`,
			uk: `${userId}#topListener#first#artist#week#${week}`,
		},
		second: {
			pk: `${perspective}#topListener#second#artist#week#${week}`,
			uk: `${userId}#topListener#second#artist#week#${week}`,
		},
		third: {
			pk: `${perspective}#topListener#third#artist#week#${week}`,
			uk: `${userId}#topListener#third#artist#week#${week}`,
		}
	},
	month: {
		first: {
			pk: `${perspective}#topListener#first#artist#month#${month}`,
			uk: `${userId}#topListener#first#artist#month#${month}`,
		},
		second: {
			pk: `${perspective}#topListener#second#artist#month#${month}`,
			uk: `${userId}#topListener#second#artist#month#${month}`,
		},
		third: {
			pk: `${perspective}#topListener#third#artist#month#${month}`,
			uk: `${userId}#topListener#third#artist#month#${month}`,
		}
	},
	life: {
		first: {
			pk: `${perspective}#topListener#first#artist#life#life`,
			uk: `${userId}#topListener#first#artist#life#life`,
		},
		second: {
			pk: `${perspective}#topListener#second#artist#life#life`,
			uk: `${userId}#topListener#second#artist#life#life`,
		},
		third: {
			pk: `${perspective}#topListener#third#artist#life#life`,
			uk: `${userId}#topListener#third#artist#life#life`,
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



export const comparePersonalAndGroupScore = (personal: number, group: number) => {

	return {
		status: Math.round(personal * 100) >= (Math.round(group * 100) / 2),
		total: personal
	}
}

const discoveredAndFormatAchievements = (topArtistsByPeriod: TopArtistsByPeriodType, userId: string, period: AchievementPeriodType) => {

	return topArtistsByPeriod[period].filter((artistData: any) => {
		const { personal, group, artist } = artistData
		const { status } = comparePersonalAndGroupScore(personal, group)


		return status
	}).map((artistData: any) => {
		const { personal, group, artist } = artistData
		const { total } = comparePersonalAndGroupScore(personal, group)

		const achievement = {
			userId: userId,
			total,
			...getAchievementTypes(userId)[period]['first'],
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

	for (let period in topArtistsByPeriod) {

		const derived: any = discoveredAndFormatAchievements(topArtistsByPeriod, userId, period as AchievementPeriodType)
		existingAchievements[period] = derived
	}

	return { existingAchievements }
}

export const parseAchievementsByPeriod = (usersTopArtistByPeriodData: any, userId: string) => {
    console.log('TCL: parseAchievementsByPeriod -> usersTopArtistByPeriodData', usersTopArtistByPeriodData)
	const { lifetime, thisMonth, thisWeek, today } = usersTopArtistByPeriodData
    console.log('TCL: parseAchievementsByPeriod -> thisMonth', thisMonth)
    console.log('TCL: parseAchievementsByPeriod -> thisWeek', thisWeek)
	// @ts-ignore
	const weeklyArtists = [...new Set([...today.personal, ...thisWeek.personal])]
    console.log('TCL: parseAchievementsByPeriod -> weeklyArtists', weeklyArtists)
	const topArtistsByPeriod: any = {
		week: weeklyArtists,
		month: thisMonth.personal,
		life: lifetime.personal
	}


	const achievements: any = {
		week: null,
		month: null,
		life: null
	}

	const { existingAchievements }: any = determinePossibleAchievements(achievements, topArtistsByPeriod, userId)

	return {
		achievements: existingAchievements
	}
}



export const getAchievementHistory = (userId: any) => {
	const { day, week, month, life }: any = getAchievementTypes(userId)

	const lifeTimeAchievementData: any = suspensefulHook(
		useGetUserAchievements({
			variables: { ...life.first },
			suspend: true,
			pollInterval: 15000
		})
	)

	const {
		getUserAchievements: lifetimeAchievements
	}: any = lifeTimeAchievementData

	const monthlyAchievementData: any = suspensefulHook(
		useGetUserAchievements({
			variables: { ...month.first },
			suspend: true,
			pollInterval: 15000
		})
	)

	const {
		getUserAchievements: monthlyAchievements
	}: any = monthlyAchievementData

	const weeklyAchievementData: any = suspensefulHook(
		useGetUserAchievements({
			variables: { ...week.first },
			suspend: true,
			pollInterval: 15000
		})
	)

	const { getUserAchievements: weeklyAchievements }: any = weeklyAchievementData

	const dailyAchievementData: any = suspensefulHook(
		useGetUserAchievements({
			variables: { ...day.first },
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
