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

export type ArtistStatKeys = {
	uid: string
	artistId: string
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
	date: moment.Moment,
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
	achievementValue: AchievementValue
	periodType: PeriodType
	periodValue: string
	currentTime: string
}

type TimeseriesKeys = {
	uid: string
	relationType: RelationType
	relationId: string
	periodType: PeriodType
	startPeriod: string
	endPeriod: string
}

type TopListenerParameterType = {
		artistId: string,
		achievementType: AchievementType,
		achievementValue: AchievementValue,
		periodType: PeriodType,
		periodValue: string,
		currentTime:  moment.Moment,
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
		periodType: PeriodType,
		periodValue: string
	) => string

	makeSk: (
		artistId: string,
		achievementValue: AchievementValue,
		periodType: PeriodType,
		periodValue: string,
		date: moment.Moment
	) => string

	writeAchievement: (
		achievement: Achievement
	) => Promise<PromiseResult<UpdateItemOutput, AWSError>>

	getArtistTopListeners: ({
		artistId,
		achievementType,
		achievementValue,
		periodType,
		periodValue,
		currentTime
	}: TopListenerParameterType) => Promise<PromiseResult<any, AWSError>>
}

export const TableAchievement = (
	endpoint: string,
	TableName: string
): TTableAchievement => {
	const doc = new AWS.DynamoDB.DocumentClient({ endpoint })

	const makePk = (
		artistId: string,
		achievementType: AchievementType,
		periodType: PeriodType,
		periodValue: string
	) =>
		[
			artistId,
			achievementType,
			periodType,
			periodValue
		].join('#')

	const makeSk = (
		artistId: string,
		achievementValue: AchievementValue,
		periodType: PeriodType,
		periodValue: string,
		date: moment.Moment,
	) =>
		[
			artistId,
			achievementValue,
			periodType,
			periodValue,
			date
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
			pk: makePk(artistId, achievementType, periodType, periodValue),
			sk: makeSk(artistId, achievementValue, periodType, periodValue, date),

			...rest
		})


	const getArtistTopListeners = async ({
		artistId,
		achievementType,
		achievementValue,
		periodType,
		periodValue,
		currentTime
	}: TopListenerParameterType) => {
		console.log('TCL: artistId', artistId)
		console.log('TCL: achievementType', achievementType)
		console.log('TCL: achievementValue', achievementValue)
		console.log('TCL: periodType', periodType)
		console.log('TCL: periodValue', periodValue)
		console.log('TCL: currentTime', currentTime)

		const _pk = makePk(artistId, achievementType, periodType, periodValue)
		const _sk = makeSk(
			artistId,
			achievementValue,
			periodType,
			periodValue,
			currentTime
		)
		 console.log('_pk', _pk)
		console.log('_sk', _sk)
		
		return await doc
			.query({
				TableName,
				KeyConditionExpression: 'pk = :p',
				// ScanIndexForward: false,
				ExpressionAttributeValues: {
					':p': _pk,
				},
				Limit: 3
			})
			.promise()
			.then(res => res && res.Items && res.Items.length ? res.Items[0] : null)
	}

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
		getArtistTopListeners,
		writeAchievement
	}
}


