import * as AWS from 'aws-sdk'
// import * as moment from 'moment'
// import * as R from 'ramda'
// import { UpdateItemOutput } from 'aws-sdk/clients/dynamodb'
// import { PromiseResult } from 'aws-sdk/lib/request'
// import { AWSError } from 'aws-sdk'
import { RelationType, PeriodType, StatArtistAndUser } from './TableStat'

export type AchievementType = 'Top' | 'First' | 'Location'

export type PeriodType =
	| 'day'
	| 'dow'
	| 'week'
	| 'month'
	| 'moy'
	| 'year'
	| 'life'

export type Achievement = {
	uid: string
	achievementType: AchievementType
	relationType: RelationType
	relationKey: string
	periodType: PeriodType
	periodValue: string
	Total: number
}

export type AchievementTotal = Achievement
export type AchievementArtist = Achievement & {
	artist: { name: string; id: string }
}

export type StatArtistAndUser = Achievement & AchievementArtist & {
		user: { id: string; img: string }
}

type AchievementKeys = {
    uid: string,
    achievementType: AchievementType
//   periodType: PeriodType,
//   periodValue: string,
}


export type TTableAchievement = {
	makePk: (
		uid: string,
		achievementType: AchievementType,
		relationType: RelationType,
		periodType: PeriodType,
		periodValue: string
	) => string
	makeSk: (uid: string, periodType: PeriodType, relationKey: string) => string
	updateAchievementStats: (
		stat: StatArtistAndUser
	) => any
}

export const TableAchievement = (endpoint: string, TableName: string): TTableAchievement => {
	const doc = new AWS.DynamoDB.DocumentClient({ endpoint })

	const makePk = (
		uid: string,
		achievementType: AchievementType,
		relationType: RelationType,
		periodType: PeriodType,
		periodValue: string
	) => [uid, relationType, periodType, periodValue].join('#')

	const makeSk = (uid: string, periodType: PeriodType, relationKey: string) =>
        [uid, periodType, relationKey].join('#')
    
    const updateAchievementStats = (stat: StatArtistAndUser) => {
        console.log('TCL: updateAchievementStats -> stat', stat)

        return true
    }

	return {
		makePk,
		makeSk,
		updateAchievementStats
	}
}
