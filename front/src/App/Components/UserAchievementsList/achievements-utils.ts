import { useGetUserAchievements } from '../../../types'
import { suspensefulHook } from '../../../lib/suspensefulHook'
import * as moment from 'moment'
import * as _ from 'lodash'

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

const comparePersonalAndGroupScore = (personal: number, group: number) => ({
	status: personal >= group,
	total: personal
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

export const parseAchievementsByPeriod = (usersTopArtistByPeriodData: any, userId: any) => {
	const { lifetime, thisMonth, thisWeek, today} = usersTopArtistByPeriodData
	const topArtistsByPeriod = {
		day: today.personal.artists,
		week: thisWeek.personal.artists,
		month: thisMonth.personal.artists,
		life: lifetime.personal.artists
	}


	const dailyAchievements = topArtistsByPeriod.day
		.filter((artistData: any) => {
			if (
				artistData.artist.topListeners.day &&
				artistData.artist.topListeners.day.first
			) {
				if (artistData.artist.topListeners.day.first.user.uid === userId) {
					return true
				}
			}
		})
		.map((artistData: any) => ({
			artistData,
			achievement: artistData.artist.topListeners.day.first
		}))
    console.log('TCL: parseAchievementsByPeriod -> dailyAchievements', dailyAchievements)


	const weeklyAchievements = topArtistsByPeriod.week
		.filter((artistData: any) => {
			if (
				artistData.artist.topListeners.week &&
				artistData.artist.topListeners.week.first
			) {
				if (artistData.artist.topListeners.week.first.user.uid === userId) {
					return true
				}
			}
		})
		.map((artistData: any) => ({
			artistData,
			achievement: artistData.artist.topListeners.week.first
		}))
    console.log('TCL: parseAchievementsByPeriod -> weeklyAchievements', weeklyAchievements)
	
	const monthlyAchievements = topArtistsByPeriod.month
		.filter((artistData: any) => {
			if (
				artistData.artist.topListeners.month &&
				artistData.artist.topListeners.month.first
			) {
				if (artistData.artist.topListeners.month.first.user.uid === userId) {
					return true
				}
			}
		})
		.map((artistData: any) => ({
			artistData,
			achievement: artistData.artist.topListeners.month.first
		}))
	
    console.log('TCL: parseAchievementsByPeriod -> monthlyAchievements', monthlyAchievements)

	const lifetimeAchievements = topArtistsByPeriod.life.filter((artistData: any) => {
		if (
			artistData.artist.topListeners.life &&
			artistData.artist.topListeners.life.first
		) {
			if (artistData.artist.topListeners.life.first.user.uid === userId) {
				return true
			}
		} 
	}).map((artistData: any) => ({
					artistData,
					achievement: artistData.artist.topListeners.life.first
				}))
	
    console.log('TCL: parseAchievementsByPeriod -> lifetimeAchievements', lifetimeAchievements)
		
	return {
		dailyAchievements,
		weeklyAchievements,
		monthlyAchievements,
		lifetimeAchievements,
	
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
