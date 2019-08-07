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
	keyData: any
	total: number
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


/**
 *
 * cc: Type Declaration of TableAchievement class
 *
 */

//  {
// 	pk: `${pk}#${achievementType}#${achievementValue}`,
// 	sk: `${sk}#${achievementType}#${achievementValue}`,
// 	fk: `#${achievementType}#${achievementValue}#${uid}`
// }
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

	periodsFor: (
		isoDateString: string
	) => {
		day: string
		dow: string
		week: string
		month: string
		moy: string
		year: string
		life: string
	}
	getTimeseries: (timeseriesKeys: TimeseriesKeys) => Promise<Timeseries[]>

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

export type Stat = {
  uid: string,
  relationType: RelationType,
  relationKey: string,
  periodType: PeriodType,
  periodValue: string,
  playDurationMs: number,
}

export type StatTotal = Stat
export type StatArtist = Stat & {
  artist: { name: string, genres: string[] }
}

export type StatGenre = Stat & {
  genre: string
}
type Artist = {
  id: string,
  name: string,
  images: Image[],
  external_urls: SpotifyUrl
  genres: string[]
  topListeners?: Object []
}
type SpotifyUrl = {
  spotify: string
}
type Image = {
  url: string
}


type TopArtistsRow = {
  artist: Artist,
  playDurationMs: number,
}

const byTimeThenArtistName = R.sortWith<TopArtistsRow>([
	R.descend(R.prop('playDurationMs')),
	R.ascend(R.path(['artist', 'name']))
])

const byPeriod = R.sortWith<Timeseries>([R.ascend(R.path(['period']))])



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
	
	
	  const periodsFor = (isoDateString: string) => {
			const m = moment.parseZone(isoDateString)
			return {
				day: m.format('YYYY-MM-DD'),
				dow: m.format('d'),
				week: m.format('YYYY-WW'),
				month: m.format('YYYY-MM'),
				moy: m.format('MM'),
				year: m.format('YYYY'),
				life: 'life'
			}
	  }
	
	  const getTimeseries = async ({
			uid,
			relationId,
			relationType,
			periodType,
			startPeriod,
			endPeriod
		}: TimeseriesKeys): Promise<Timeseries[]> => {
			const sk = [uid, periodType, relationId].join('#')
			const startPk = [uid, relationType, periodType, startPeriod].join('#')
			const endPk = [uid, relationType, periodType, endPeriod].join('#')
			// console.log('getting stats for', { sk, startPk, endPk })

			const params = {
				TableName,
				// Limit,
				KeyConditionExpression: `sk = :sk and pk BETWEEN :s and :e`,
				IndexName: 'GSIReverse',
				// ScanIndexForward: false,
				ExpressionAttributeValues: {
					':sk': sk,
					':s': startPk,
					':e': endPk
				}
			}
			const result = await doc
				.query(params)
				.promise()
				.then(d =>
					d.Items.map(i => ({
						// artist: i.artist,
						period: i.pk.split('#')[3],
						playDurationMs: i.playDurationMs
					}))
				)
				.then(byPeriod)
			// console.log('artistStatsFor', uid, id, result)
			return result
		}



	// const encode = ({
	// 	artistId,
	// 	achievementType,
	// 	achievementValue,
	// 	periodType,
	// 	periodValue,
	// 	date, // Current time here is coming in a string
	// 	uid,
	// 	...rest
	// }: Achievement) => {
	// 	// @ts-ignore
	// 	const lastUpdated = moment(date).format()
	// 	// @ts-ignore
	// 	const calendarDay = moment(date).format('MMMM-Do-YYYY')

	// 	console.log('TCL: date inside encode, should be a string', date)
	// 	console.log('TCL: lastUpdated', lastUpdated)

	// 	return {
	// 		pk: makePk(artistId, achievementType, periodType, periodValue),
	// 		sk: makeSk(
	// 			artistId,
	// 			achievementValue,
	// 			periodType,
	// 			periodValue,
	// 			calendarDay // Current time here is coming in a string
	// 		),
	// 		fk: makeFk(
	// 			artistId,
	// 			achievementType,
	// 			achievementValue,
	// 			periodType,
	// 			periodValue,
	// 			calendarDay, // Current time here is coming in a string
	// 			uid
	// 		),
	// 		lastUpdated,
	// 		...rest
	// 	}
	// }

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
		keyData,
		total,
		user
	}: Achievement) => {
	
		return await doc
			.put({
				TableName,
				Item: {
					...keyData,
					total,
					user
				}
			})
			.promise()
	}

	return {
		makePk,
		makeSk,
		makeFk,
		periodsFor,
		getTimeseries,
		getArtistTopListeners,
		getUserAchievementsByArtist,
		getUserAchievements,
		createOrModifyAchievement
	}
}
