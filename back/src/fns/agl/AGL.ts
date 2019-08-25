import * as moment from 'moment'
import * as _ from 'lodash'
import { TTableAchievement, AchievementRecord, CreateAchievementRecordDataParams } from '../../shared/SharedTypes';
import { KeyMaker } from '../../shared/keyMaker';



export class ArtistAndGenreLeaders {
    indexToAchievementMap: { 0: string; 1: string; 2: string; }; 

    constructor() {
        this.indexToAchievementMap = {
        0: 'first',
        1: 'second',
        2: 'third'
        }
    }


    async enrichAndRecordAchievement (
        topListenerData: any,
        index: number,
        tableAchievement: TTableAchievement
    ) {
        const achievementType = 'topListener'
        const achievementValue = this.indexToAchievementMap[index]
        const keyData = KeyMaker().makeAchievementCreationKeys({
            achievementType,
            achievementValue,
            ...topListenerData
        })
        const { artist, user, total, lastUpdated } = topListenerData
        const achievementData: CreateAchievementRecordDataParams = {
            artist, user, total, lastUpdated
        }
    
        const newAchievement: AchievementRecord = await tableAchievement.createOrModifyAchievement(keyData, achievementData)
        console.log('TCL: newAchievement', newAchievement)
    
        return newAchievement
    
    }
    
}


export const localizedMoment = (utcOffset: number, m: moment.Moment) =>
	moment.utc(m).utcOffset(utcOffset, false)

export const localizedISOString = (m: moment.Moment) => m.toISOString(true)






    
    //  const extractPeriodTypeAndValue = ({ pk, sk }) => {
    //     const split = pk.split('#')
    //     const end = split.length - 1
    
    //     const periodType = split[end - 1]
    //     const periodValue = split[end]
    
    //     return {
    //         periodType,
    //         periodValue
    //     }
    // }
    
    

    
    