import * as AWS from 'aws-sdk'
import * as moment from 'moment'
import * as R from 'ramda'
import { UpdateItemOutput } from 'aws-sdk/clients/dynamodb'
import { PromiseResult } from 'aws-sdk/lib/request'
import { AWSError, Response } from 'aws-sdk'

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

export type Achievement = {
	keyData: any
	total: number
	lastUpdated: string
	user: any
	artist: Artist
}

export type GetUserAchievementItem = {
	lastUpdated: any
	total: number
	fk: string
	artist: any
	sk: string
	pk: string
	user: any
}

export type AchievementTotal = number
export type AchievementArtist = Achievement & {
	artist: { name: string; id: string }
	playDurationMs: number
}

type UserAchievementByArtistParams = {
	aglPK: string
	userFK: string
}

export type KeyData = {
	sk: string
	pk: string
	fk?: string
}

type TopListenerParameterType = KeyData & {}

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
		sk,
		pk
	}: KeyData) => Promise<PromiseResult<any, AWSError>>

	getUserAchievements: (
		pk: string,
		fk: string
	) => Promise<
		PromiseResult<
			any | [GetUserAchievementItem] | GetUserAchievementItem,
			AWSError
		>
	>

	getUserAchievementsByArtist: ({
		aglPK,
		userFK
	}: UserAchievementByArtistParams) => Promise<PromiseResult<any, AWSError>>
}

export type Stat = {
	uid: string
	relationType: RelationType
	relationKey: string
	periodType: PeriodType
	periodValue: string
	playDurationMs: number
}

export type StatTotal = Stat
export type StatArtist = Stat & {
	artist: { name: string; genres: string[] }
}

export type StatGenre = Stat & {
	genre: string
}
type Artist = {
	id: string
	name: string
	images: Image[]
	external_urls: SpotifyUrl
	genres: string[]
	topListeners?: Object[]
}
type SpotifyUrl = {
	spotify: string
}
type Image = {
	url: string
}

type TopArtistsRow = {
	artist: Artist
	playDurationMs: number
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
	const doc = new AWS.DynamoDB.DocumentClient({
		endpoint
	})

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

		return result
	}

	/**
	 *
	 * cc:Achievements Lambda#5; Function createOrModifyAchievement;
	 *
	 */

	const getArtistTopListeners = async ({ sk, pk }: KeyData) => {
		const status = () => {
			let place
			if(pk.split('#').includes('topListener') &&
				pk.split('#').includes('first')) {
				place = 'first'
			}
			
			if(pk.split('#').includes('topListener') &&
				pk.split('#').includes('second')) {
				place = 'second'
			}
			
			if(pk.split('#').includes('topListener') &&
				pk.split('#').includes('third')) {
				place = 'third'
				}
		}
		const aglStatus = {
			type: 'topListener',
			place: status()
		}

		return await doc
			.query({
				TableName,
				KeyConditionExpression: 'pk = :p and sk <= :s',
				ExpressionAttributeValues: {
					':p': pk,
					':s': sk
				},
				Limit: 3
			})
			.promise()
			.then(res => {
				if (res && res.Items && res.Items.length) {
					let user = res.Items.pop()
					user.achievements = aglStatus
					return user
				} else {
					return null
				}
			})
	}
{
	
}
	const getUserAchievementsByArtist = async ({
		aglPK,
		userFK
	}: UserAchievementByArtistParams) => {
		
			return await doc
				.query({
					TableName,
					IndexName: 'UserTimeIndex',
					KeyConditionExpression: 'pk = :p AND fk = :f',
					ExpressionAttributeValues: {
						':p': aglPK,
						':f': userFK
					}
				})
				.promise()
				.then((res: any) => {
					const achievements:
						| [GetUserAchievementItem]
						| GetUserAchievementItem
						| [] = res && res.Items && res.Items.length ? res.Items : []
					console.log('getUserAchievementsByArtist: ', achievements)

					return achievements
				})
	}

	const getUserAchievements = async (pk: string, fk: string) => {
		return await doc
			.query({
				TableName,
				IndexName: 'UserTimeIndex',
				KeyConditionExpression: 'pk = :p AND fk = :f',
				ExpressionAttributeValues: {
					':p': pk,
					':f': fk
				}
			})
			.promise()
			.then((res: any) => {
				const achievements:
					| [GetUserAchievementItem]
					| GetUserAchievementItem
					| [] = res && res.Items && res.Items.length ? res.Items : []
				console.log(
					'TCL: user achievements from db table achievements',
					achievements
				)

				return achievements
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
		lastUpdated,
		user,
		artist
	}: Achievement) => {
		return await doc
			.put({
				TableName,
				Item: {
					...keyData,
					total,
					lastUpdated,
					user,
					artist
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
