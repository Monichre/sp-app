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
		  ({[k]: o[k]})
	  )
	);
}
  
const flattenObj = (obj: any) => Object.assign({}, ..._flatten(obj))

	

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


/*=============================================
	=            NOTES ON KEYS            =

	ak: AchievementType#AchievementValue#RelationType#RelationTypeId#PeriodType#PeriodValue. Ex: topListener#first#artist#4c2Fb5kfVRzodXZvitxnWk#month#2019-08

	pk: AchievementType#AchievementValue#RelationType#PeriodType#PeriodValue. Ex: topListener#first#artist#month#2019-08

	uk: UserId#AchievementType#AchievementValue#RelationType#PeriodType#PeriodValue. Ex: spotify:124053034#topListener#first#artist#month#2019-08

	auk: ArtistId#PeriodType#PeriodValue#RelationType(User)#RelationTypeId. Ex: 4c2Fb5kfVRzodXZvitxnWk#month#2019-08#user#spotify:124053034
	

=============================================*/

export const getAchievementTypes = (userId: any) => ({
	day: {
		first: {
			
			pk: `topListener#first#artist#day#${day}`,
			uk: `${userId}#topListener#first#artist#day#${day}`
		},
		second: {
			pk: `topListener#second#artist#day#${day}`,
			uk: `${userId}#topListener#second#artist#day#${day}`
		},
		third: {
			pk: `topListener#third#artist#day#${day}`,
			uk: `${userId}#topListener#third#artist#day#${day}`
		}
	},
	week: {
		first: {
			pk: `topListener#first#artist#week#${week}`,
			uk: `${userId}#topListener#first#artist#week#${week}`,
		},
		second: {
			pk: `topListener#second#artist#week#${week}`,
			uk: `${userId}#topListener#second#artist#week#${week}`,
		},
		third: {
			pk: `topListener#third#artist#week#${week}`,
			uk: `${userId}#topListener#third#artist#week#${week}`,
		}
	},
	month: {
		first: {
			pk: `topListener#first#artist#month#${month}`,
			uk: `${userId}#topListener#first#artist#month#${month}`,
		},
		second: {
			pk: `topListener#second#artist#month#${month}`,
			uk: `${userId}#topListener#second#artist#month#${month}`,
		},
		third: {
			pk: `topListener#third#artist#month#${month}`,
			uk: `${userId}#topListener#third#artist#month#${month}`,
		}
	},
	life: {
		first: {
			pk: `topListener#first#artist#life#life`,
			uk: `${userId}#topListener#first#artist#life#life`,
		},
		second: {
			pk: `topListener#second#artist#life#life`,
			uk: `${userId}#topListener#second#artist#life#life`,
		},
		third: {
			pk: `topListener#third#artist#life#life`,
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
	console.log('TCL: group', Math.round(group  * 100))
	console.log('TCL: personal', Math.round(personal * 100))
	
	
	return {status: Math.round(personal * 100) >= Math.round(group  * 100),
	total: personal}
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
			pk: getAchievementTypes(userId)[period]['first'],
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

	return {existingAchievements}
}

export const parseAchievementsByPeriod = (usersTopArtistByPeriodData: any, userId: string) => {
	const { lifetime, thisMonth, thisWeek, today } = usersTopArtistByPeriodData
	// @ts-ignore
	const weeklyArtists = [...new Set([...today.personal, ...thisWeek.personal])]
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

	// for (let period in topArtistsByPeriod) {
		
	// 	achievements[period] = topArtistsByPeriod[period].filter((artistData: any) => {

	// 		if (
	// 			artistData.artist.topListeners[period] &&
	// 			artistData.artist.topListeners[period].first
	// 		) {
	// 			if (artistData.artist.topListeners[period].first.user.uid === userId) {
	// 				return true
	// 			}
	// 		}
	// 	})
	// 		.map((artistData: any) => ({
	// 			artistData,
	// 			achievement: artistData.artist.topListeners[period].first
	// 		}))
		
	// 	if (!achievements[period].length) {
	// 		achievements[period] = null
	// 	}
	// }

	

	const { existingAchievements }: any = determinePossibleAchievements(achievements, topArtistsByPeriod, userId)
    


	return {
		achievements: existingAchievements
	}
}



export const getAchievementHistory = (userId: any) => {
	const { day, week, month, life }: any = getAchievementTypes(userId)

	const lifeTimeAchievementData: any = suspensefulHook(
		useGetUserAchievements({
			variables: {...life.first },
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
