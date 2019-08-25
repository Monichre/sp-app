import { AKKeyRetrievalData, AchievementRetrievalKeys, StatRecordPreAchievementMetaDataKeyParams } from './SharedTypes';

/*=============================================
	=            NOTES ON KEYS            =

	ak: AchievementType#AchievementValue#RelationType#RelationTypeId#PeriodType#PeriodValue. Ex: topListener#first#artist#4c2Fb5kfVRzodXZvitxnWk#month#2019-08

	pk: AchievementType#AchievementValue#RelationType#PeriodType#PeriodValue. Ex: topListener#first#artist#month#2019-08

	uk: UserId#AchievementType#AchievementValue#RelationType#PeriodType#PeriodValue. Ex: spotify:124053034#topListener#first#artist#month#2019-08
	
	auk: ArtistId#PeriodType#PeriodValue#RelationType(User)#RelationTypeId. Ex: 4c2Fb5kfVRzodXZvitxnWk#month#2019-08#user#spotify:124053034
	

=============================================*/

export const KeyMaker = () => {

    const joinKeyParams = args => [...args].join('#')

	const makeAKRetrievalKeys = ({
		periodType,
        periodValue,
        artistId,
        achievementType,
		achievementValue
	}: AKKeyRetrievalData) => {
        
        const ak = [achievementType, achievementValue, 'artist', artistId, periodType, periodValue].join('#')
        const pk = [achievementType, achievementValue, 'artist', periodType, periodValue].join('#')

        return {
            pk,
            ak
        }
    }

    const makeAchievementCreationKeys = ({ achievementType, achievementValue, pk, artistAchievementsId }: StatRecordPreAchievementMetaDataKeyParams) => {

		const splitPK: string[] = pk.split('#')
		const userId = splitPK[0]
		let aID: any = artistAchievementsId.split('#') // length 4
	
		aID.length = 3
		aID = aID.join('#')
	
		const pkFragment = splitPK.slice(1, splitPK.length).join('#')
		const newPK = `${achievementType}#${achievementValue}#${pkFragment}`
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


    return {
        joinKeyParams,
        makeAKRetrievalKeys,
        makeAchievementCreationKeys,
        makeAchievementRetrievalKeys
    }


}