
// import * as moment from 'moment'
// import * as _ from 'lodash'
// import { TTableAchievement } from '../../shared/SharedTypes';
// import { KeyMaker } from '../../shared/keyMaker';


// export const localizedMoment = (utcOffset: number, m: moment.Moment) =>
// 	moment.utc(m).utcOffset(utcOffset, false)

// export const localizedISOString = (m: moment.Moment) => m.toISOString(true)




// export const extractPeriodTypeAndValue = ({ pk, sk }) => {
// 	const split = pk.split('#')
// 	const end = split.length - 1

// 	const periodType = split[end - 1]
// 	const periodValue = split[end]

// 	return {
// 		periodType,
// 		periodValue
// 	}
// }


// export const indexToAchievementMap = {
// 	0: 'first',
// 	1: 'second',
// 	2: 'third'
// }






// export const enrichAndRecordAchievement = async (
// 	topListenerData: any,
// 	index: number,
// 	tableAchievement: TTableAchievement
// ) => {
// 	const achievementType = 'topListener'
// 	const achievementValue = indexToAchievementMap[index]
// 	const keyData = KeyMaker().makeAchievementCreationKeys({
// 		achievementType,
// 		achievementValue,
// 		...topListenerData
// 	})
// 	const { artist, user, total, lastUpdated } = topListenerData
// 	const achievementData = {
// 		artist, user, total, lastUpdated
// 	}

// 	const newAchievement = await tableAchievement.createOrModifyAchievement(keyData, achievementData)
// 	console.log('TCL: newAchievement', newAchievement)

// 	return newAchievement

// }
