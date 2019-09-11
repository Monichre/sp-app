import { TTableStat, PeriodType, TableStat } from '../../shared/tables/TableStat';
import { ArtistAndGenreLeaders } from '../agl/AGL'
import * as moment from 'moment'
import { verifyEnv } from '../../shared/env';
import { makeLogger } from '../logger';
import { TableAchievement } from '../../shared/tables/TableAchievement'
import { TableUser } from '../../shared/tables/TableUser';


const AGL = new ArtistAndGenreLeaders()

const localizedMoment = (utcOffset: number, m: moment.Moment) =>
    moment.utc(m).utcOffset(utcOffset, false)

const localizedISOString = (m: moment.Moment) => m.toISOString(true)

const determineTopListenersFromStatsTable = async (artistTopListenerAchievementsId: any, tableStat: any, tableUser: any) => {

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



export const AchievementEnrichment = (user: any) => {

    /**
     *
     * Environment Variables/Resources & Database Tables
     *
     */

    const log = makeLogger({
        handler: 'onPlayUpdateAchievements',
        awsEvent: 'ddbs'
    })
    const env: any = verifyEnv(
        {
            DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
            TABLE_ACHIEVEMENT: process.env.TABLE_ACHIEVEMENT,
            TABLE_STAT: process.env.TABLE_STAT,
            TABLE_USER: process.env.TABLE_USER
        },
        log
    )
    const tableAchievement: any = TableAchievement(
        env.DYNAMO_ENDPOINT,
        env.TABLE_ACHIEVEMENT
    )
    const tableStat: any = TableStat(
        env.DYNAMO_ENDPOINT,
        env.TABLE_STAT
    )
    const tableUser: any = TableUser(env.DYNAMO_ENDPOINT, env.TABLE_USER)

    // @ts-ignore
    const now: any = user ? localizedMoment(user.utcOffset, moment()) : localizedMoment(0, moment())
    const data: any = tableStat.periodsFor(localizedISOString(now))



    const recordTopListenerAchievements = async (topListenerData: any, index: number) => {
        const d: any = await AGL.enrichAndRecordAchievement(
            topListenerData,
            index,
            tableAchievement
        )
        return d
    }


    const calculateAchievementsTimeSeries = async ({ artistId }: any) => await Promise.all(Object.keys(data).map(async (period: any) => {
        const periodValue = data[period]
        const artistTopListenerAchievementsId = `${artistId}#${period}#${periodValue}#user`
        const periodTopListeners: any[] = await determineTopListenersFromStatsTable(artistTopListenerAchievementsId, tableStat, tableUser)
        const periodAchievements = await Promise.all(periodTopListeners.map(async (topListenerData: any, index: any) => await recordTopListenerAchievements(topListenerData, index)))

        return periodAchievements

    }))


    const initialize = async () => {

        console.log('RUNNING INITIALIZE')

        if (user) {
            const { uid } = user
            const topArtists = await Promise.all(Object.keys(data).map(async (periodType: any) => {
                const periodValue = data[periodType]
                const Limit = 20
                return await tableStat.getTopArtists({ uid, periodType: periodType, periodValue: periodValue, Limit })

            }))
                .then(res => res.flat())
                .then(res => res.map(({ artist }) => artist))

            const unique = Array.from(new Set(topArtists.map(a => a.id))).map(id => topArtists.find(a => a.id === id))
            const achievements = await Promise.all(unique.map(async (artist: any) => await calculateAchievementsTimeSeries(({ artistId: artist.id }))))
            console.log('TCL: initialize -> achievements', achievements)

        }
    }

    return {
        initialize,
        calculateAchievementsTimeSeries
    }

}

export const StatEnrichment = async (user: any) => {
    console.log('RUNNING StatEnrichment')

    const log = makeLogger({
        handler: 'onPlayUpdateAchievements',
        awsEvent: 'ddbs'
    })
    const env: any = verifyEnv(
        {
            DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
            TABLE_ACHIEVEMENT: process.env.TABLE_ACHIEVEMENT,
            TABLE_STAT: process.env.TABLE_STAT,
            TABLE_USER: process.env.TABLE_USER
        },
        log
    )
    const tableAchievement: any = TableAchievement(
        env.DYNAMO_ENDPOINT,
        env.TABLE_ACHIEVEMENT
    )
    const tableStat: any = TableStat(
        env.DYNAMO_ENDPOINT,
        env.TABLE_STAT
    )
    const tableUser: any = TableUser(env.DYNAMO_ENDPOINT, env.TABLE_USER)

    // @ts-ignore
    const now: any = user ? localizedMoment(user.utcOffset, moment()) : localizedMoment(0, moment())
    const data: any = tableStat.periodsFor(localizedISOString(now))

    // Fucking Extract This
    const { uid } = user
    const topArtists = await Promise.all(Object.keys(data).map(async (periodType: any) => {
        const periodValue = data[periodType]
        const Limit = 20
        return await tableStat.getTopArtists({ uid, periodType: periodType, periodValue: periodValue, Limit })

    }))
        .then(res => res.flat())
        .then(res => res.map(({ artist }) => artist))

    const unique = Array.from(new Set(topArtists.map(a => a.id))).map(id => topArtists.find(a => a.id === id))

    const recordsToUpdate = await Promise.all(unique.map(async (artist: any) => {
        const artistRecordsToUpdate = await tableStat.findRecordsWithoutArtistAchievementId(uid, artist.id)
        console.log('TCL: StatEnrichment -> artistRecordsToUpdate', artistRecordsToUpdate)

        // TODO(1): no data is being returned from artistRecordsToUpdate locally BUT the next step is to iterate through (Promise.all) and extract the {pk, sk} from the record, create the appropriate artistAchievementsId and proceed to update the record by setting the artistAchievementsId, using the new tableStats function updateArtistStatWithArtistAchievementsId ... fairly straightforward? 
        // TODO(1A): Need an extract periodType and periodValue function from the pk/sk (to create the artistAchievementsId)


    }))

    return []


    // TODO(1): Iterate through top artists and create user oriented Stat pks and the analogous user + artist oriented sks, return those {pk, sk} in an array
    // TODO(2): Loop through the array and request that record from the Stat table:
    // TODO(2A) - If the record

}
