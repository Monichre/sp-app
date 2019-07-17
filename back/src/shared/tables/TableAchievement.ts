import * as AWS from 'aws-sdk'
import * as moment from 'moment'
import * as R from 'ramda'
import { UpdateItemOutput } from 'aws-sdk/clients/dynamodb'
import { PromiseResult } from 'aws-sdk/lib/request'
import { AWSError } from 'aws-sdk'

export type PeriodType =
	| 'day'
	| 'dow'
	| 'week'
	| 'month'
	| 'moy'
	| 'year'
	| 'life'

export type RelationType = 'total' | 'artist' | 'genre' | 'user'

export type TopKeys = {
	uid: string
	periodType: PeriodType
	periodValue: string
	Limit: number
}

export type StatKeys = {
	uid: string
	periodType: PeriodType
	periodValue: string
}

export type ArtistStatKeys = {
	uid: string
	artistId: string
	periodType: PeriodType
	periodValue: string
}

export type GenreStatKeys = {
	uid: string
	genre: string
	periodType: PeriodType
	periodValue: string
}

export type AchievementType =
	| 'topListener'
	| 'firstToStream'
	
export type AchievementValue = 'first' | 'second' | 'third'
	

export type Achievement = {
	artistId: string
	achievementType: AchievementType
	achievementValue: AchievementValue
	periodType: PeriodType
	periodValue: string
	uid: string
	total: number
	date: string
	user?: any
}

export type AchievementMetric = {
	uid: string
	achievementType: AchievementType
	artistId: string
	periodType: PeriodType
	periodValue: string
	playDurationMs: number
	artist: { name: string; id: string }
	user: { name: string; id: string }
}

export type AchievementTotal = number
export type AchievementArtist = Achievement & {
	artist: { name: string; id: string }
	playDurationMs: number
}

export type StatArtistAndUser = Achievement &
	AchievementArtist & {
		user: { id: string; img: string }
	}

type AchievementStatKeys = {
	artistId: string
	achievementType: AchievementType
	periodType: PeriodType
	periodValue: string
	uid: string
}

type TimeseriesKeys = {
	uid: string
	relationType: RelationType
	relationId: string
	periodType: PeriodType
	startPeriod: string
	endPeriod: string
}

type Timeseries = {
	playDurationMs: number
	period: string
}

const byPeriod = R.sortWith<Timeseries>([R.ascend(R.path(['period']))])

export type TTableAchievement = {
	makePk: (
		artistId: string,
		achievementType: AchievementType,
		achievementValue: AchievementValue,
		periodType: PeriodType,
		periodValue: string,
		date: string
	) => string

	makeSk: (
		artistId: string,
		achievementType: AchievementType,
		achievementValue: AchievementValue,
		periodType: PeriodType,
		periodValue: string,
		date: string,
		uid: string
	) => string

	writeAchievement: (
		achievement: Achievement
	) => Promise<PromiseResult<UpdateItemOutput, AWSError>>
}

export const TableAchievement = (
	endpoint: string,
	TableName: string
): TTableAchievement => {
	const doc = new AWS.DynamoDB.DocumentClient({ endpoint })

	const makePk = (
		artistId: string,
		achievementType: AchievementType,
		achievementValue: AchievementValue,
		periodType: PeriodType,
		periodValue: string,
		date: string
	) =>
		[
			artistId,
			achievementType,
			achievementValue,
			periodType,
			periodValue,
			date
		].join('#')

	const makeSk = (
		artistId: string,
		achievementType: AchievementType,
		achievementValue: AchievementValue,
		periodType: PeriodType,
		periodValue: string,
		date: string,
		uid: string
	) =>
		[
			artistId,
			achievementType,
			achievementValue,
			periodType,
			periodValue,
			date,
			uid
		].join('#')
	
	  const encode = ({
			artistId,
			achievementType,
			achievementValue,
			periodType,
			periodValue,
			date,
			uid,
			...rest
		}: Achievement) => ({
			pk: makePk(
				artistId,
				achievementType,
				achievementValue,
				periodType,
				periodValue,
				date
			),
			sk: makeSk(
				artistId,
				achievementType,
				achievementValue,
				periodType,
				periodValue,
				date,
				uid
			),

			...rest
		})


	// const getAchievementStatTopListener = async ({
	// 	artistId,
	// 	achievementType,
	// 	periodType,
	// 	periodValue,
	// 	uid
	// }: AchievementStatKeys) => {
	// 	return await doc
	// 		.get({
	// 			TableName,
	// 			Key: {
	// 				pk: makePk(artistId, achievementType, periodType, periodValue),
	// 				sk: makeSk(achievementType, periodType, periodType, uid)
	// 			}
	// 		})
	// 		.promise()
	// 		.then(res => {
	// 			console.log('TCL Get AchievementStatTopListener: res', res)
	// 			// (r.Item && (r.Item.playDurationMs as number)) || 0

	// 		})
	// }

	// const periodsFor = (isoDateString: string) => {
	// 	const m = moment.parseZone(isoDateString)
	// 	return {
	// 		day: m.format('YYYY-MM-DD'),
	// 		dow: m.format('d'),
	// 		week: m.format('YYYY-WW'),
	// 		month: m.format('YYYY-MM'),
	// 		moy: m.format('MM'),
	// 		year: m.format('YYYY'),
	// 		life: 'life'
	// 	}
	// }

	// const getTimeseries = async ({
	// 	uid,
	// 	relationId,
	// 	relationType,
	// 	periodType,
	// 	startPeriod,
	// 	endPeriod
	// }: TimeseriesKeys): Promise<Timeseries[]> => {
	// 	const sk = [uid, periodType, relationId].join('#')
	// 	const startPk = [uid, relationType, periodType, startPeriod].join('#')
	// 	const endPk = [uid, relationType, periodType, endPeriod].join('#')
	// 	// console.log('getting stats for', { sk, startPk, endPk })

	// 	const params = {
	// 		TableName,
	// 		// Limit,
	// 		KeyConditionExpression: `sk = :sk and pk BETWEEN :s and :e`,
	// 		IndexName: 'GSIReverse',
	// 		// ScanIndexForward: false,
	// 		ExpressionAttributeValues: {
	// 			':sk': sk,
	// 			':s': startPk,
	// 			':e': endPk
	// 		}
	// 	}
	// 	const result = await doc
	// 		.query(params)
	// 		.promise()
	// 		.then(d =>
	// 			d.Items.map(i => ({
	// 				// artist: i.artist,
	// 				period: i.pk.split('#')[3],
	// 				playDurationMs: i.playDurationMs
	// 			}))
	// 		)
	// 		.then(byPeriod)
	// 	// console.log('artistStatsFor', uid, id, result)
	// 	return result
	// }

	// const updateAchievementStats = async ({
	// 	uid,
	// 	relationType,
	// 	relationKey,
	// 	periodType,
	// 	periodValue,
	// 	playDurationMs
	// }: AchievementMetric) => {
	// 	return await doc
	// 		.update({
	// 			TableName,
	// 			Key: {
	// 				pk: makePk(uid, relationType, periodType, periodValue),
	// 				sk: makeSk(uid, periodType, relationKey)
	// 			},
	// 			UpdateExpression: 'ADD playDurationMs :v',
	// 			ExpressionAttributeValues: { ':v': playDurationMs }
	// 		})
	// 		.promise()
	// }

	const writeAchievement = async ({
		artistId,
		achievementType,
		achievementValue,
		periodType,
		periodValue,
		date,
		uid,
		total,
		user
	}: Achievement) => {
		return await doc
			.put({
				TableName,
				Item: {
					...encode({
						artistId,
						achievementType,
						achievementValue,
						periodType,
						periodValue,
						date,
						uid,
						total,
						user
					})
				}
			})
			.promise()
	}

	return {
		makePk,
		makeSk,
		writeAchievement
	}
}


