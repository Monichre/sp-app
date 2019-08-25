import * as AWS from 'aws-sdk'
import * as moment from 'moment'
import * as R from 'ramda'
import { Timeseries } from '../../fns/graphql/types';
import { TTableAchievement, StatRecordPreAchievementMetaDataKeyParams, KeyData, GetUserAchievementItem, TopArtistsRow, TimeseriesKeys, UserAchievementByArtistParams, AchievementRetrievalKeys, AKKeyRetrievalData, ArtistAchievementRetrievalKeys } from '../SharedTypes';
import { PeriodType } from './TableStat';
import { KeyMaker } from '../keyMaker';

/*=============================================
	=            NOTES ON KEYS            =

	ak: AchievementType#AchievementValue#RelationType#RelationTypeId#PeriodType#PeriodValue. Ex: topListener#first#artist#4c2Fb5kfVRzodXZvitxnWk#month#2019-08

	pk: AchievementType#AchievementValue#RelationType#PeriodType#PeriodValue. Ex: topListener#first#artist#month#2019-08

	uk: UserId#AchievementType#AchievementValue#RelationType#PeriodType#PeriodValue. Ex: spotify:124053034#topListener#first#artist#month#2019-08

	auk: ArtistId#PeriodType#PeriodValue#RelationType(User)#RelationTypeId. Ex: 4c2Fb5kfVRzodXZvitxnWk#month#2019-08#user#spotify:124053034
	

=============================================*/

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


	type EnrichedKeyMakerParams = {
		relationType: 'artist'
		periodType: PeriodType
		periodValue: string
		artistId: string
		achievementType: 'topListener'
		achievementValue: 'first' | 'second' | 'third'
		uid?: string | null
	}

	const joinKeyParams = (args: any) => [...args].join('#')

	const makeAchievementCreationKeys = ({ achievementType, achievementValue, pk, artistAchievementsId }: StatRecordPreAchievementMetaDataKeyParams) => {

		const splitPK: string[] = pk.split('#')
		const userId = splitPK[0]
		let aID: any = artistAchievementsId.split('#') // length 4

		aID.length = 3
		aID = aID.join('#')

		const pkFragment = splitPK.slice(1, splitPK.length).join('#')
		const newPK = `${achievementType}#${achievementValue}#${pkFragment}#${splitPK.pop()}`
		const ak = `${achievementType}#${achievementValue}#artist#${aID}`
		const auk = `${artistAchievementsId}#${userId}` // cc: artistUserKey
		const uk = `${userId}#${achievementType}#${achievementValue}#${pkFragment}#${splitPK.pop()}`


		return {
			pk: newPK,
			ak,
			auk,
			uk
		}

	}

	const makeAKRetrievalKeys = ({
		periodType,
		periodValue,
		artistId,
		achievementType,
		achievementValue
	}: AKKeyRetrievalData) => {
		const { makeAKRetrievalKeys } = KeyMaker()

		return makeAKRetrievalKeys({
			periodType,
			periodValue,
			artistId,
			achievementType,
			achievementValue
		})

	}

	const makeAchievementRetrievalKeys = ({
		periodType,
		periodValue,
		artistId,
		achievementType,
		achievementValue
	}: AchievementRetrievalKeys) => {
		// const { makeAchievementRetrievalKeys } = KeyMaker()

		// return makeAchievementRetrievalKeys({
		// 	periodType,
		// 	periodValue,
		// 	artistId,
		// 	achievementType,
		// 	achievementValue
		// })


	}



	/**
	 *
	 * cc: FilterKey GSI; Switched up the order of the artistId and uid so they are inverse of the makePk
	 *
	 */


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

	// const params = {
	// 	TableName,
	// 	// Limit,
	// 	KeyConditionExpression: `sk = :sk and pk BETWEEN :s and :e`,
	// 	IndexName: 'GSIReverse',
	// 	// ScanIndexForward: false,
	// 	ExpressionAttributeValues: {
	// 		':sk': sk,
	// 		':s': startPk,
	// 		':e': endPk
	// 	}
	// }
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

	// 	return result
	// }


	// cc: ArtistAchievementHoldersGSI#2; Uses the ArtistAchievementHoldersGSI. We actually don't need the pk here
	// cc: TODO: Remove PK
	const getArtistAchievementHolders = async ({ pk, ak }: ArtistAchievementRetrievalKeys) => {

		const params = {
			TableName,
			Limit: 3,
			KeyConditionExpression: `ak = :ak`,
			IndexName: 'ArtistAchievementHoldersGSI',
			ScanIndexForward: false, // means descending
			ExpressionAttributeValues: {
				':ak': ak
			}
		}

		return await doc
			.query(params)
			.promise()
			.then((res: any) => {
				console.log('TCL: getArtistAchievementHolders -> res', res)
				return res.Items && res.Items.length ? res.Items : []

			})
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

	const getUserAchievements = async (pk: string, uk: string) => {

		const params = {
			TableName,
			KeyConditionExpression: `pk = :pk AND uk = :uk`,
			IndexName: 'UserAchievementGSI',
			ScanIndexForward: false, // means descending
			ExpressionAttributeValues: {
				':pk': pk,
				':uk': uk
			}
		}

		return await doc.query(params).promise().then((res: any) => {
			console.log('TCL: getUserAchievements -> res', res)
			return res.Items && res.Items.length ? res.Items : []
		})
	}

	/**
	 *
	 * cc:Achievements Lambda#4; createOrModifyAchievement function definition;
	 *
	 */

	const createOrModifyAchievement: any = async (
		keyData,
		achievementData
	) => {

		// Super hacky bullshit to get Typescript to fuck off while also
		// providing type safety 

		const Item: Achievement = {
			...keyData,
			...achievementData
		}

		const achievement: Achievement = await doc
			.put({
				TableName,
				Item: {
					...keyData,
					...achievementData
				}
			})
			.promise()
			.then((res: any) => Item)

		return achievement
	}

	return {
		makeAchievementCreationKeys,
		makeAKRetrievalKeys,
		periodsFor,
		// makeAchievementRetrievalKeys,
		getArtistAchievementHolders,
		getUserAchievementsByArtist,
		getUserAchievements,
		createOrModifyAchievement
	}
}
// getTimeseries,