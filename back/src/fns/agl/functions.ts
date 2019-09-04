import { TTableStat, PeriodType, TableStat } from '../../shared/tables/TableStat';
import { ArtistAndGenreLeaders } from '../agl/AGL'
import moment = require('moment');
import { verifyEnv } from '../../shared/env';
import { makeLogger } from '../logger';
import { TableAchievement } from '../../shared/tables/TableAchievement'
import { TableUser } from '../../shared/tables/TableUser';


const AGL = new ArtistAndGenreLeaders()

const localizedMoment = (utcOffset: number, m: moment.Moment) =>
    moment.utc(m).utcOffset(utcOffset, false)

const localizedISOString = (m: moment.Moment) => m.toISOString(true)

const determineTopListenersFromStatsTable = async (artistTopListenerAchievementsId, tableStat, tableUser) => {

    const topListeners = await tableStat.getArtistTopListeners(
        artistTopListenerAchievementsId
    )
 
    return topListeners.length ? await Promise.all(topListeners.map(async (topListenerData: any) => {
        const { userId } = topListenerData
        const { valid: user } = await tableUser.getUser(userId)
        topListenerData.user = user

        return topListenerData
        
    })) : []

}

const recordTopListenerAchievements = async (topListenerData: any, index: number, tableAchievement) => {
    const d: any = await AGL.enrichAndRecordAchievement(
        topListenerData,
        index,
        tableAchievement
    )
    return d
}

export const calculateAchievementsTimeSeries = async ({ artistId }) => {
    const log = makeLogger({
        handler: 'onPlayUpdateAchievements',
        awsEvent: 'ddbs'
    })
    const env = verifyEnv(
        {
            DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
            TABLE_ACHIEVEMENT: process.env.TABLE_ACHIEVEMENT,
            TABLE_STAT: process.env.TABLE_STAT,
            TABLE_USER: process.env.TABLE_USER
        },
        log
    )
    const tableAchievement = TableAchievement(
        env.DYNAMO_ENDPOINT,
        env.TABLE_ACHIEVEMENT
    )
    const tableStat = TableStat(
        env.DYNAMO_ENDPOINT,
        env.TABLE_STAT
    )
    const tableUser = TableUser(env.DYNAMO_ENDPOINT, env.TABLE_USER)

    // @ts-ignore
    const now = localizedMoment(0, moment())
    const data = tableStat.periodsFor(localizedISOString(now))
    
    /*=============================================
    data looks like this: { 
        day,
        week,
        month,
        life 
    }
    =============================================*/
    
    await Promise.all(Object.keys(data).map(async (period: any) => {
        const periodValue = data[period]
        const artistTopListenerAchievementsId = `${artistId}#${period}#${periodValue}#user`
        const periodTopListeners: any[] = await determineTopListenersFromStatsTable(artistTopListenerAchievementsId, tableStat, tableUser)

        const periodAchievements = await Promise.all(periodTopListeners.map(async (topListenerData: any, index: any) => await recordTopListenerAchievements(topListenerData, index, tableAchievement)))
        
        console.log('TCL: calculateAchievementsTimeSeries -> periodTopListeners', periodTopListeners)
        console.log('TCL: calculateAchievementsTimeSeries -> periodAchievements', periodAchievements)
    }))
}

