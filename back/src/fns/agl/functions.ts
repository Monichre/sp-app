import { TTableStat, PeriodType, TableStat } from '../../shared/tables/TableStat';

import { ArtistAndGenreLeaders } from '../agl/AGL'

import { TPlaytimeTimescopeStatsKeys } from '../graphql/schema/stat/insightsArtistStats';

import { timeSeries } from '../graphql/schema/stat/shared/timeSeries';

import moment = require('moment');

import { verifyEnv } from '../../shared/env';
import { makeLogger } from '../logger';
import { TableAchievement } from '../../shared/tables/TableAchievement'
import { TableUser } from '../../shared/tables/TableUser';


const AGL = new ArtistAndGenreLeaders()

const localizedMoment = (utcOffset: number, m: moment.Moment) =>
    moment.utc(m).utcOffset(utcOffset, false)

const localizedISOString = (m: moment.Moment) => m.toISOString(true)

export const hrsAndMins = (durationMs: number) => {
    const d = moment.duration(durationMs)
    return {
        hrs: Math.abs(Math.trunc(d.asHours())),
        mins: Math.abs(d.minutes())
    }
}

const hrsMaybeMins = ({ hrs, mins }: { hrs: number; mins: number }) =>
    hrs > 100 ? { hrs } : { hrs, mins }




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

const playtimePerspectiveStats = async (
    tableStat: TTableStat,
    uid: string,
    artistId: string,
    periodType: PeriodType,
    periodCurrent: string,
    periodPrev?: string
) => {
    const currentMs = await tableStat.getArtistStat({
        uid,
        periodType,
        periodValue: periodCurrent,
        artistId
    })
    const current = hrsMaybeMins(hrsAndMins(currentMs))
    if (!periodPrev) {
        return { current }
    }
    const prevMs = await tableStat.getArtistStat({
        uid,
        periodType,
        periodValue: periodPrev,
        artistId
    })
    const deltaMs = currentMs - prevMs
    const direction: 'up' | 'down' | null =
        deltaMs == 0 ? null : deltaMs >= 0 ? 'up' : 'down'

    const delta =
        deltaMs == 0
            ? null
            : {
                direction,
                ...hrsMaybeMins(hrsAndMins(deltaMs))
            }

    return {
        current,
        delta
    }
}

const playtimeTimescopeStats = async (
    tableStat: TTableStat,
    {
        timeseriesLabel,
        timeseriesPeriodType,
        uid,
        gid,
        artistId,
        endDate,
        unit,
        distance,
        periodType,
        periodCurrent,
        periodPrev
    }: TPlaytimeTimescopeStatsKeys
) => ({
    timeseries: await timeSeries(tableStat, timeseriesLabel, {
        endDate,
        unit,
        distance,
        uid,
        gid,
        periodType: timeseriesPeriodType,
        relationType: 'artist',
        relationId: artistId
    }),
    personal: await playtimePerspectiveStats(
        tableStat,
        uid,
        artistId,
        periodType,
        periodCurrent,
        periodPrev
    ),
    group: await playtimePerspectiveStats(
        tableStat,
        'global',
        artistId,
        periodType,
        periodCurrent,
        periodPrev
    )
})

const playtimeStats = async (
    tableStat: TTableStat,
    uid: string,
    gid: string,
    artistId: string,
    now: moment.Moment
) => {
    const {
        day: today,
        week: thisWeek,
        month: thisMonth,
        life
    } = tableStat.periodsFor(localizedISOString(now))
    const { day: yest } = tableStat.periodsFor(
        localizedISOString(now.clone().subtract(1, 'days'))
    )
    const { week: lastWeek } = tableStat.periodsFor(
        localizedISOString(now.clone().subtract(1, 'weeks'))
    )
    const { month: lastMonth } = tableStat.periodsFor(
        localizedISOString(now.clone().subtract(1, 'months'))
    )

    const artist = await tableStat.getArtistInfo(artistId)



    return {
        artist,
        today: await playtimeTimescopeStats(tableStat, {
            uid,
            gid,
            artistId,
            periodType: 'day',
            periodCurrent: today,
            endDate: now,
            periodPrev: yest,
            timeseriesLabel: 'past 7 days',
            timeseriesPeriodType: 'day',
            unit: 'days',
            distance: 7
        }),
        thisWeek: await playtimeTimescopeStats(tableStat, {
            uid,
            gid,
            artistId,
            periodType: 'week',
            periodCurrent: thisWeek,
            endDate: now,
            periodPrev: lastWeek,
            timeseriesLabel: 'past 7 days',
            timeseriesPeriodType: 'day',
            unit: 'days',
            distance: 7
        }),
        thisMonth: await playtimeTimescopeStats(tableStat, {
            uid,
            gid,
            artistId,
            periodType: 'month',
            periodCurrent: thisMonth,
            endDate: now,
            periodPrev: lastMonth,
            timeseriesLabel: 'past 30 days',
            timeseriesPeriodType: 'day',
            unit: 'days',
            distance: 30
        }),
        lifetime: await playtimeTimescopeStats(tableStat, {
            uid,
            gid,
            artistId,
            periodType: 'life',
            periodCurrent: life,
            endDate: now,
            timeseriesLabel: 'past 12 weeks',
            timeseriesPeriodType: 'week',
            unit: 'weeks',
            distance: 12
        })

    }
}


export const calculateAchievementsTimeSeries = async ({ gid, artistId }) => {
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
    /*
        day,
        week,
        month,
        life
    */

    await Promise.all(Object.keys(data).map(async (period: any) => {
        const periodValue = data[period]
        const artistTopListenerAchievementsId = `${artistId}#${period}#${periodValue}#user`
        const periodTopListeners: any[] = await determineTopListenersFromStatsTable(artistTopListenerAchievementsId, tableStat, tableUser)

        const periodAchievements = await Promise.all(periodTopListeners.map(async (topListenerData: any, index: any) => await recordTopListenerAchievements(topListenerData, index, tableAchievement)))
        
        console.log('TCL: calculateAchievementsTimeSeries -> periodTopListeners', periodTopListeners)
        console.log('TCL: calculateAchievementsTimeSeries -> periodAchievements', periodAchievements)
    }))

    // await Promise.all(users.map(async (user: any) => {


    //     const playTimeStats: any = await playtimeStats(
    //         tableStat,
    //         user.uid,
    //         gid,
    //         artistId,
    //         now
    //     )

    //     return playTimeStats
    // }))

}

