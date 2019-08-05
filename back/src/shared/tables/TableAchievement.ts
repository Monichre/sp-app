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

	getUserAchievements: (
		uid: string,
		achievementType: AchievementType,
		achievementValue: AchievementValue,
		periodType: PeriodType,
		periodValue: string,
		date: string
	) => Promise<PromiseResult<any, AWSError>>

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

	const makeKey = (args: any[]) => [...args].join('#')

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

	/**
	 *
	 * cc: FilterKey GSI; Switched up the order of the artistId and uid so they are inverse of the makePk
	 *
	 */

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
			uid,
			achievementType,
			achievementValue,
			periodType,
			periodValue,
			date,
			artistId
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
		// @ts-ignore
		const lastUpdated = moment(date).format()
		// @ts-ignore
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
		const _pk = makePk(artistId, achievementType, periodType, periodValue)
		const _sk = makeSk(
			artistId,
			achievementValue,
			periodType,
			periodValue,
			date.format('MMMM-Do-YYYY') // cc: Current time here is coming in as a moment object parameter and needs to be made into a string
		)

		/*=============================================
		
		cc: Since we're querying for records between a set of time stamps we may receive several records. The records are ordered from oldest to newest. Here we take the newest record.

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

	const getUserAchievements = async ({
		uid,
		achievementType,
		achievementValue,
		periodType,
		periodValue,
		date
	}: any) => {
		const _pk = makeKey([achievementType, periodType, periodValue])
		const _sk = makeKey([achievementValue, periodType, periodValue, date])

		return await doc
			.query({
				TableName,
				KeyConditionExpression: 'pk contains :p AND sk contains :s AND fk BEGINS WITH :f',
				ExpressionAttributeValues: {
					':p': _pk,
					':s': _sk,
					':f': uid
				},
				Limit: 3
			})
			.promise()
			.then(res => {
				console.log('TCL: res', res)
				return res && res.Items && res.Items.length ? res.Items : null
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
		let item = {
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
		getUserAchievements,
		createOrModifyAchievement
	}
}
