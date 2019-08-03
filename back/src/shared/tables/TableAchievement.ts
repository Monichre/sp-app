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

export type AchievementType = 'topListener' | 'firstToStream'

export type AchievementValue = 'first' | 'second' | 'third'

// type AchievementDateParam = {
// 	date: moment.Moment
// }

export type Achievement = {
	artistId: string
	achievementType: AchievementType
	achievementValue: AchievementValue
	periodType: PeriodType
	periodValue: string
	uid: string
	total: number
	date: string
	lastUpdated?: moment.Moment
	user?: any
}

export type AchievementTotal = number
export type AchievementArtist = Achievement & {
	artist: { name: string; id: string }
	playDurationMs: number
}

type UserAchievementByArtistParams = {
	artistId: string
	achievementType: AchievementType
	achievementValue: AchievementValue
	periodType: PeriodType
	periodValue: string
	date: moment.Moment
	uid: string
}

type TopListenerParameterType = {
	artistId: string
	achievementType: AchievementType
	achievementValue: AchievementValue
	periodType: PeriodType
	periodValue: string
	date: moment.Moment // Will become a string
}

type Timeseries = {
	playDurationMs: number
	period: string
}

/**
 *
 * cc: Type Declaration of TableAchievement class
 *
 */

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
		date: string
	) => string

	makeFk: (
		artistId: string,
		achievementType: AchievementType,
		achievementValue: AchievementValue,
		periodType: PeriodType,
		periodValue: string,
		date: string,
		// Might need to add the lastUpdated field to this filter key?
		uid: string
	) => string

	createOrModifyAchievement: (
		achievement: Achievement
	) => Promise<PromiseResult<UpdateItemOutput, AWSError>>

	getArtistTopListeners: ({
		artistId,
		achievementType,
		achievementValue,
		periodType,
		periodValue,
		date
	}: TopListenerParameterType) => Promise<PromiseResult<any, AWSError>>

	getUserAchievementsByArtist: ({
		artistId,
		achievementType,
		achievementValue,
		periodType,
		periodValue,
		uid
	}: UserAchievementByArtistParams) => Promise<PromiseResult<any, AWSError>>
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
	) => [artistId, achievementType, periodType, periodValue].join('#')

	const makeSk = (
		artistId: string,
		achievementValue: AchievementValue,
		periodType: PeriodType,
		periodValue: string,
		date: string
	) => [artistId, achievementValue, periodType, periodValue, date].join('#')

	const makeFk = (
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
		date, // Current time here is coming in a string
		uid,
		...rest
	}: Achievement) => {

		const lastUpdated = moment(date).format()
		const calendarDay = moment(date).format('MMMM-Do-YYYY')

		console.log('TCL: date inside encode, should be a string', date)
        console.log('TCL: lastUpdated', lastUpdated)
		

		return {
			pk: makePk(artistId, achievementType, periodType, periodValue),
			sk: makeSk(
				artistId,
				achievementValue,
				periodType,
				periodValue,
				calendarDay // Current time here is coming in a string
			),
			fk: makeFk(
				artistId,
				achievementType,
				achievementValue,
				periodType,
				periodValue,
				calendarDay, // Current time here is coming in a string
				uid
			),
			lastUpdated,
			...rest
		}
	}

	// cc:Achievements Lambda#5; Function createOrModifyAchievement;
	const getArtistTopListeners = async ({
		artistId,
		achievementType,
		achievementValue,
		periodType,
		periodValue,
		date // is a moment object
	}: TopListenerParameterType) => {
		
		const isMoment = moment.isMoment(date)
		const isValid = date.isValid()

		console.log('TCL: isMoment', isMoment)
		console.log('TCL: date', date)
		console.log('TCL: date.isValid()', isValid)

		const refTime = moment()
			.startOf('day')
			.format()
		const _pk = makePk(artistId, achievementType, periodType, periodValue)
		const _sk = makeSk(
			artistId,
			achievementValue,
			periodType,
			periodValue,
			date.format('MMMM-Do-YYYY') // Current time here is coming in as a moment object parameter and needs to be made into a string
		)
		const _rk = makeSk(
			artistId,
			achievementValue,
			periodType,
			periodValue,
			refTime
		)
		
		console.log('TCL: achievementValue', achievementValue)
		console.log('TCL: periodType', periodType)
		console.log('TCL: periodValue', periodValue)
		console.log('TCL: refTime', refTime)
		console.log('TCL: _sk', _sk)
		console.log('TCL: _rk', _rk)

		/*=============================================
		
		// cc: Since we're querying for records between a set of time stamps we may receive several records. The records are ordered from oldest to newest. Here we take the newest record.

		=============================================*/
		
		return await doc
			.query({
				TableName,
				KeyConditionExpression: 'pk = :p and sk <= :s',
				ExpressionAttributeValues: {
					':p': _pk,
					':s': _sk
				},
				Limit: 3
			})
			.promise()
			.then(res => {
				console.log(`Im the reponse for ${achievementValue} top listener`, res)
				if (res && res.Items && res.Items.length) {
					let user = res.Items.pop()
					console.log('TCL: user', user)
					return user
				} else {
					return null
				}
			})
	}

	const getUserAchievementsByArtist = async ({
		artistId,
		achievementType,
		achievementValue,
		periodType,
		periodValue,
		date,
		uid
	}: UserAchievementByArtistParams) => {
		const _pk = makePk(artistId, achievementType, periodType, periodValue)
		const _sk = makeSk(
			artistId,
			achievementValue,
			periodType,
			periodValue,
			date.format('MMMM-Do-YYYY') // cc: Current time here is coming in as a moment object parameter and needs to be made into a string
		)

		
		/**
		 *
		 * cc: Do we need the current time?
		 *
		 */
		
		
		const _fk = makeFk(
			artistId,
			achievementType,
			achievementValue,
			periodType,
			periodValue,
			date.format('MMMM-Do-YYYY'), // cc: Current time here is coming in as a moment object parameter and needs to be made into a string
			uid
		)

		return await doc
			.query({
				TableName,
				KeyConditionExpression: 'pk = :p AND sk <= :s AND fk <= :f',
				ExpressionAttributeValues: {
					':p': _pk,
					':s': _sk,
					':f': _fk
				},
				Limit: 3
			})
			.promise()
			.then(res => {
				console.log('TCL: res', res)
				return res && res.Items && res.Items.length ? res.Items[0] : null
			})
	}

	
	/**
	 *
	 * cc:Achievements Lambda#4; createOrModifyAchievement function definition;
	 *
	 */
	
	
	const createOrModifyAchievement = async ({
		artistId,
		achievementType,
		achievementValue,
		periodType,
		periodValue,
		date, // Current time here is coming in a string
		uid,
		total,
		user
	}: Achievement) => {

		let item = {Item: {
					...encode({
						artistId,
						achievementType,
						achievementValue,
						periodType,
						periodValue,
						date, // Therefore this is a string
						uid,
						total,
						user
					})
		}
		}
		
        console.log('Use this item object to write tests', item)
		
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
						date, // Therefore this is a string
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
		makeFk,
		getArtistTopListeners,
		getUserAchievementsByArtist,
		createOrModifyAchievement
	}
}

// // user IDs
// :"spotify:yw19fznedr2b4dxo55cmjz11h"

// : "spotify:xnx2fj5o8x2fgl1hdr10jjars"

// :"spotify:a0rcusksyscdoa1f7ylnot6c8"
