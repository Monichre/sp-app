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
        const keyDataGlobal = KeyMaker().makeAchievementCreationKeys({
            perspectiveUID: 'global',
            achievementType,
            achievementValue,
            ...topListenerData
        })
        
        const keyDataPersonal = KeyMaker().makeAchievementCreationKeys({
            perspectiveUID: 'personal',
            achievementType,
            achievementValue,
            ...topListenerData
        })
        
        const { artist, user, total, lastUpdated } = topListenerData
        const achievementData: CreateAchievementRecordDataParams = {
            artist, user, total, lastUpdated
        }

        let success = false

        try {
            await tableAchievement.createOrModifyAchievement(keyDataPersonal, achievementData)

            await tableAchievement.createOrModifyAchievement(keyDataGlobal, achievementData)

            success = true
        } catch (err) {
            console.log('TCL: ArtistAndGenreLeaders -> err', err)

        }


        return success


    }

}


export const localizedMoment = (utcOffset: number, m: moment.Moment) =>
    moment.utc(m).utcOffset(utcOffset, false)

export const localizedISOString = (m: moment.Moment) => m.toISOString(true)


