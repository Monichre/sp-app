import { AKKeyRetrievalData, AchievementRetrievalKeys, StatRecordPreAchievementMetaDataKeyParams } from './SharedTypes';
import * as moment from 'moment'
/*=============================================
	=            NOTES ON KEYS            =

	ak: Perspective#AchievementType#AchievementValue#RelationType#RelationTypeId#PeriodType#PeriodValue. Ex: topListener#first#artist#4c2Fb5kfVRzodXZvitxnWk#month#2019-08

	pk: Perspective#AchievementType#AchievementValue#RelationType#RelationId#PeriodType#PeriodValue. Ex: topListener#first#artist#month#2019-08

	uk: Perspective#UserId#AchievementType#AchievementValue#RelationType#PeriodType#PeriodValue. Ex: spotify:124053034#topListener#first#artist#month#2019-08
	
	auk: Perspective#ArtistId#PeriodType#PeriodValue#RelationType(User)#RelationTypeId. Ex: 4c2Fb5kfVRzodXZvitxnWk#month#2019-08#user#spotify:124053034
	

=============================================*/

export const KeyMaker = () => {

	const joinKeyParams = args => [...args].join('#')

	const makeAKRetrievalKeys = ({
		perspectiveUID,
		periodType,
		periodValue,
		artistId,
		achievementType,
		achievementValue
	}: AKKeyRetrievalData) => {

		const ak = [achievementType, achievementValue, 'artist', artistId, periodType, periodValue].join('#')
		const pk = [perspectiveUID, achievementType, achievementValue, 'artist', periodType, periodValue].join('#')

		return {
			pk,
			ak
		}
	}

	const makeAchievementCreationKeys = ({
		perspectiveUID,
		achievementType,
		achievementValue,
		pk,
		artistAchievementsId
	}: StatRecordPreAchievementMetaDataKeyParams) => {

		const splitPK: string[] = pk.split('#')
		const userId = splitPK[0]
		let aID: any = artistAchievementsId.split('#') // length 4

		aID.length = 3
		aID = aID.join('#')

		const pkFragment = splitPK.slice(1, splitPK.length).join('#')
		const newPK = `${perspectiveUID}#${achievementType}#${achievementValue}#${pkFragment}`
		const ak = `${achievementType}#${achievementValue}#artist#${aID}`
		const auk = `${artistAchievementsId}#${userId}` // cc: artistUserKey
		const uk = `${userId}#${achievementType}#${achievementValue}#${pkFragment}`


		return {
			pk: newPK,
			ak,
			auk,
			uk
		}

	}


	const makeAchievementRetrievalKeys = ({
		periodType,
		periodValue,
		artistId,
		achievementType,
		achievementValue
	}: AchievementRetrievalKeys) => {

		const ak = ``
		const auk = ``
		const uk = ``
		const pk = ``


		return {
			pk,
			ak,
			auk,
			uk
		}

	}

	const makeAKTimeSeriesRetrievalKeys = (perspectiveUID='global', artistId: any) => {

		// @ts-ignore
		const day = moment().format('YYYY-MM-DD')
		// @ts-ignore
		const week = `${moment().year()}-${moment().week()}`
		// @ts-ignore
		const month = `${moment().year()}-${moment().month()}`


		return {
			day: {
				first: {

					pk: `${perspectiveUID}#topListener#first#artist#day#${day}`,
					ak: `topListener#first#artist#${artistId}#day#${day}`
				},
				second: {
					pk: `${perspectiveUID}#topListener#second#artist#day#${day}`,
					ak: `topListener#second#artist#${artistId}#day#${day}`
				},
				third: {
					pk: `${perspectiveUID}#topListener#third#artist#day#${day}`,
					ak: `topListener#third#artist#${artistId}#day#${day}`
				}
			},
			week: {
				first: {
					pk: `${perspectiveUID}#topListener#first#artist#week#${week}`,
					ak: `topListener#first#artist#${artistId}#week#${week}`,
				},
				second: {
					pk: `${perspectiveUID}#topListener#second#artist#week#${week}`,
					ak: `topListener#second#artist#${artistId}#week#${week}`,
				},
				third: {
					pk: `${perspectiveUID}#topListener#third#artist#week#${week}`,
					ak: `topListener#third#artist#${artistId}#week#${week}`,
				}
			},
			month: {
				first: {
					pk: `${perspectiveUID}#topListener#first#artist#month#${month}`,
					ak: `topListener#first#artist#${artistId}#month#${month}`,
				},
				second: {
					pk: `${perspectiveUID}#topListener#second#artist#month#${month}`,
					ak: `topListener#second#artist#${artistId}#month#${month}`,
				},
				third: {
					pk: `${perspectiveUID}#topListener#third#artist#month#${month}`,
					ak: `topListener#third#artist#${artistId}#month#${month}`,
				}
			},
			life: {
				first: {
					pk: `${perspectiveUID}#topListener#first#artist#life#life`,
					ak: `topListener#first#artist#${artistId}#life#life`,
				},
				second: {
					pk: `${perspectiveUID}#topListener#second#artist#life#life`,
					ak: `topListener#second#artist#${artistId}#life#life`,
				},
				third: {
					pk: `${perspectiveUID}#topListener#third#artist#life#life`,
					ak: `topListener#third#artist#${artistId}#life#life`,
				}
			}
		}
	}




	return {
		joinKeyParams,
		makeAKRetrievalKeys,
		makeAchievementCreationKeys,
		makeAKTimeSeriesRetrievalKeys,
		makeAchievementRetrievalKeys
	}


}