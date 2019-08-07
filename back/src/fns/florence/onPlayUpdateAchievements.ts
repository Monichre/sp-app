import { DynamoDBStreamHandler, DynamoDBRecord, StreamRecord } from 'aws-lambda'
import { verifyEnv } from '../../shared/env'
import { makeLogger, TLogger } from '../logger'
import { TableStat } from '../../shared/tables/TableStat'
import { TableUser } from '../../shared/tables/TableUser'
import { TableAchievement } from '../../shared/tables/TableAchievement'
import * as _ from 'lodash'
import * as moment from 'moment'

type Env = {
	DYNAMO_ENDPOINT: string
	TABLE_ACHIEVEMENT: string
	TABLE_STAT: string
	TABLE_USER: string
	QUEUE_VALIDATION_ERRORS: string
}
const filterByArtistKeysOnly = records =>
	records.filter(record => {
		console.log('TCL: record', record)
		console.log('TCL: record.dynamodb', record.dynamodb)
		console.log('TCL: record.dynamodb.NewImage', record.dynamodb.NewImage)

		return record.dynamodb.NewImage.artist ? record : false
	})

const isArtistOrGlobal = NewImage => (NewImage.artist ? 'artist' : 'global')

const retrieveArtistAndUserKeys = records => {
	const userKeys = []
	const artistKeys = []

	records.forEach(({ dynamodb: { Keys, NewImage: { artist } } }) => {
		userKeys.push(Keys)
		artistKeys.push(artist.M)
	})

	return {
		userKeys,
		artistKeys
	}
}

/**
 *
 * cc: This function gets the user's total time listened value by artist id; Extract this out
 *
 */

const getArtistStatForUser = async (user, artistId, tableStat) =>
	await tableStat.getArtistStat({
		uid: user.uid,
		artistId: artistId,
		periodType: 'life',
		periodValue: 'life'
	})

const getGlobalStatForUser = async (user, periodType, periodValue, tableStat) =>
	await tableStat.getArtistStat({
		uid: user.uid,
		periodType,
		periodValue
	})

const extractKeys = ({ pk, sk }) => ({
	pk: pk.S,
	sk: sk.S
})

const keyMaker = ({ recordKeys, achievementType, achievementValue, uid }) => {
	const { pk, sk } = recordKeys

	return {
		pk: `${pk}#${achievementType}#${achievementValue}`,
		sk: `${sk}#${achievementType}#${achievementValue}`,
		fk: `#${achievementType}#${achievementValue}#${uid}`
	}
}

// cc: Extract this out
// const getStatForUser = async (user, ) =>
// 	await Promise.all(
// 		users.map(async (user: any) => {
// 			const { utcOffset } = user
// 			const now = localizedMoment(utcOffset, moment())
// 			const userStat = await getUserStat(user, artistId, tableStat)
// 			const userHandle = user.displayName ? user.displayName : user.email

// 			console.log(
// 				'User: ',
// 				userHandle,
// 				`Total Time Listened for artist ${artist.name.S}: ${userStat} milleseconds`
// 			)
// 			return {
// 				user,
// 				ttl: userStat,
// 				date: now
// 			}
// 		})
// 	)

// const handleRecord = (record: any) => {
//     const { dynamodb: {
//         Keys, ApproximateCreationDateTime, NewImage
//     } } = record

//     const typeOfStat = isArtistOrGlobal(NewImage)

//     if (typeOfStat === 'artist') {
//         // We wanna use getArtistStat
//     } else {
//         // We wanna use getStat
//     }

// }

/**
 *
 * cc: Achievements Lambda#1; Beginning of the create/update Achievements Lambda; Receives an event parameters as array of Records
 *
 */

export const handler: DynamoDBStreamHandler = async (event, context) => {
	console.log('TCL: handler:DynamoDBStreamHandler -> event', event)
	const log = makeLogger({
		handler: 'onPlayUpdateAchievements',
		awsEvent: 'ddbs'
	})
	log.info(`${event.Records.length} records`)
	const env = verifyEnv(
		{
			DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
			TABLE_ACHIEVEMENT: process.env.TABLE_ACHIEVEMENT,
			TABLE_STAT: process.env.TABLE_STAT,
			TABLE_USER: process.env.TABLE_USER,
			QUEUE_VALIDATION_ERRORS: process.env.QUEUE_VALIDATION_ERRORS
		},
		log
	)
	const tableAchievement = TableAchievement(
		env.DYNAMO_ENDPOINT,
		env.TABLE_ACHIEVEMENT
	)
	const tableStat = TableStat(env.DYNAMO_ENDPOINT, env.TABLE_STAT)
	const tableUser = TableUser(env.DYNAMO_ENDPOINT, env.TABLE_USER)
	const allUsers: any = await tableUser.getAllSpotifyCreds()

	const { valids } = allUsers
	console.log('TCL: handler:DynamoDBStreamHandler -> allUsers', allUsers)

	const handleRecord = async (record: any) => {
		const {
			dynamodb: { Keys, ApproximateCreationDateTime, NewImage }
		} = record

		const { day, week, month, life } = tableAchievement.periodsFor(
			ApproximateCreationDateTime
		)
		console.log('TCL: handleRecord -> month', month)

		const typeOfStat = isArtistOrGlobal(NewImage)
		const indexToAchievementMap = {
			0: 'first',
			1: 'second',
			2: 'third'
		}
		const recordKeys = extractKeys(Keys)
		console.log('TCL: handleRecord -> typeOfStat', typeOfStat)

		if (typeOfStat === 'artist') {
			const { artist } = NewImage

			const userData = await Promise.all(
				valids.map(async (user: any) => {
					const dayData = await tableStat.getArtistStat({
						uid: user.uid,
						artistId: artist.M.id.S,
						periodType: 'day',
						periodValue: day
					})
					console.log('TCL: handleRecord -> dayData', dayData)
					const weekData = await tableStat.getArtistStat({
						uid: user.uid,
						artistId: artist.M.id.S,
						periodType: 'week',
						periodValue: week
					})
					console.log('TCL: handleRecord -> weekData Artist', weekData)
					const monthData = await tableStat.getArtistStat({
						uid: user.uid,
						artistId: artist.M.id.S,
						periodType: 'month',
						periodValue: month
					})
					const lifeData = await tableStat.getArtistStat({
						uid: user.uid,
						artistId: artist.M.id.S,
						periodType: 'life',
						periodValue: life
					})
					return {
						recordKeys,
						user,
						dayData,
						weekData,
						monthData,
						lifeData
					}
				})
			)
			// console.log('userData', userData)

			const dailyTops = _.sortBy(userData, d => d.dayData).reverse()
			const weeklyTops = _.sortBy(userData, d => d.weekData).reverse()
			const monthlyTops = _.sortBy(userData, d => d.monthData).reverse()
			const lifetimeTops = _.sortBy(userData, d => d.lifeData).reverse()

			await Promise.all(
				dailyTops.map(async (daily, index) => {
					console.log('TCL: handleRecord -> index', index)
					if (index <= 2) {
						const { recordKeys, user, dayData } = daily
						const achievementType = 'topListener'
						const achievementValue = indexToAchievementMap[index]
						const { uid } = user
						const total = dayData
						
						console.log('TCL: handleRecord -> dayData', dayData)
						const keyData = keyMaker({
							recordKeys,
							achievementType,
							achievementValue,
							uid
						})
						const newAchievement = await tableAchievement.createOrModifyAchievement(
							{
								keyData,
								total,
								user

							}
						)
						console.log('TCL: handleRecord -> newAchievement', newAchievement)
					}
				})
			)

			
			/**
			 *
			 * Weekly Achievement Creation
			 *
			 */
			
			

			await Promise.all(
				weeklyTops.map(async (weekly, index) => {
					console.log('TCL: handleRecord -> index', index)
					if (index <= 2) {
						const { recordKeys, user, weekData } = weekly
						const achievementType = 'topListener'
						const achievementValue = indexToAchievementMap[index]
						const { uid } = user
						const total = weekData

						console.log('TCL: handleRecord -> weekData', weekData)

						const keyData = keyMaker({
							recordKeys,
							achievementType,
							achievementValue,
							uid
						})

						const newAchievement = await tableAchievement.createOrModifyAchievement(
							{
								keyData,
								total,
								user
							}
						)
						console.log('TCL: handleRecord -> newAchievement', newAchievement)
					}
				})
			)

			
			/**
			 *
			 * Weekly Achievement Creation
			 *
			 */
			
			

			await Promise.all(
				monthlyTops.map(async (monthly, index) => {
					console.log('TCL: handleRecord -> index', index)
					if (index <= 2) {
						const { recordKeys, user, monthData } = monthly
						const achievementType = 'topListener'
						const achievementValue = indexToAchievementMap[index]
						const { uid } = user
						const total = monthData

						console.log('TCL: handleRecord -> monthData', monthData)

						const keyData = keyMaker({
							recordKeys,
							achievementType,
							achievementValue,
							uid
						})

						const newAchievement = await tableAchievement.createOrModifyAchievement(
							{
								keyData,
								total,
								user
							}
						)
						console.log('TCL: handleRecord -> newAchievement', newAchievement)
					}
				})
			)

			// await Promise.all(
			// 	lifetimeTops.map(async (lifetime, index) => {
			// 		console.log('TCL: handleRecord -> index', index)
			// 		if (index <= 2) {
			// 			const { recordKeys, user, monthData } = monthly
			// 			const achievementType = 'topListener'
			// 			const achievementValue = indexToAchievementMap[index]
			// 			const { uid } = user
			// 			const total = monthData

			// 			console.log('TCL: handleRecord -> monthData', monthData)

			// 			const keyData = keyMaker({
			// 				recordKeys,
			// 				achievementType,
			// 				achievementValue,
			// 				uid
			// 			})

			// 			const newAchievement = await tableAchievement.createOrModifyAchievement(
			// 				{
			// 					keyData,
			// 					total,
			// 					user
			// 				}
			// 			)
			// 			console.log('TCL: handleRecord -> newAchievement', newAchievement)
			// 		}
			// 	})
			// )

			return userData
		} else {
			const userData = await Promise.all(
				valids.map(async (user: any) => {
					const dayData = await tableStat.getStat({
						uid: user.uid,
						periodType: 'day',
						periodValue: day
					})
					const weekData = await tableStat.getStat({
						uid: user.uid,
						periodType: 'week',
						periodValue: week
					})
					const monthData = await tableStat.getStat({
						uid: user.uid,
						periodType: 'month',
						periodValue: month
					})
					const lifeData = await tableStat.getStat({
						uid: user.uid,
						periodType: 'life',
						periodValue: life
					})
				 

					return {
						recordKeys,
						user,
						dayData,
						weekData,
						monthData,
						lifeData
					}
				})
			)

			const dailyTops = _.sortBy(userData, d => d.dayData).reverse()
			const weeklyTops = _.sortBy(userData, d => d.weekData).reverse()
			const monthlyTops = _.sortBy(userData, d => d.monthData).reverse()
			const lifetimeTops = _.sortBy(userData, d => d.lifeData).reverse()

			return userData
		}
	}

	console.log('event.Records', event.Records)

	await Promise.all(
		event.Records.map(async record => await handleRecord(record))
	)

	log.close()
}

// import { DynamoDBStreamHandler, DynamoDBRecord, StreamRecord } from 'aws-lambda'
// import { verifyEnv } from '../../shared/env'
// import { makeLogger, TLogger } from '../logger'
// import { TableStat } from '../../shared/tables/TableStat'
// import { TableUser } from '../../shared/tables/TableUser'
// import { TableAchievement } from '../../shared/tables/TableAchievement'
// import * as _ from 'lodash'
// import * as moment from 'moment'

// /*=============================================

// cc:Achievement Current Time Key/Attribute#1;Moment Object v String;+5;This will be used as the metric to sort/filter achievements (sk and fk keys on the Achievements Table). This is localized

// cc: We want this data in two formats one to store as the day of the achievement record to which we will continue to make updates and the other as a isostring (? - I think) in the very least as timestamp in the following format: 'MMMM Do YYYY, h:mm:ss a'. This we will use as the value for the last updated field on the Achievement object

// =============================================*/

// const localizedMoment = (utcOffset: number, m: moment.Moment) =>
// 	moment
// 		.utc(m)
// 		.utcOffset(utcOffset, false)
// 		.format()

// const localizedISOString = (m: moment.Moment) => m.toISOString(true)
// console.log('TCL: localizedISOString', localizedISOString)

// type Env = {
// 	DYNAMO_ENDPOINT: string
// 	TABLE_ACHIEVEMENT: string
// 	TABLE_STAT: string
// 	TABLE_USER: string
// 	QUEUE_VALIDATION_ERRORS: string
// }
// const filterByArtistKeysOnly = records =>
// 	records.filter(record => {
// 		console.log('TCL: record', record)
// 		console.log('TCL: record.dynamodb', record.dynamodb)
// 		console.log('TCL: record.dynamodb.NewImage', record.dynamodb.NewImage)

// 		return  (record.dynamodb.NewImage.artist ? record : false)

// 	})

// const retrieveArtistAndUserKeys = records => {
// 	const userKeys = []
// 	const artistKeys = []

// 	records.forEach(({ dynamodb: { Keys, NewImage: { artist } } }) => {
// 		userKeys.push(Keys)
// 		artistKeys.push(artist.M)
// 	})

// 	return {
// 		userKeys,
// 		artistKeys
// 	}
// }

// /**
//  *
//  * cc: This function gets the user's total time listened value by artist id; Extract this out
//  *
//  */

// const getUserStat = async (user, artistId, tableStat) =>
// 	await tableStat.getArtistStat({
// 		uid: user.uid,
// 		artistId: artistId,
// 		periodType: 'life',
// 		periodValue: 'life'
// 	})

// 	// cc: Extract this out
// const getStatsForUsers = async (artist, artistId, users, tableStat) =>  await Promise.all(
// 		users.map(async (user: any) => {
// 			const { utcOffset } = user
// 			const now = localizedMoment(utcOffset, moment())
// 			const userStat = await getUserStat(user, artistId, tableStat)
// 			const userHandle = user.displayName ? user.displayName : user.email

// 			console.log(
// 				'User: ',
// 				userHandle,
// 				`Total Time Listened for artist ${
// 					artist.name.S
// 				}: ${userStat} milleseconds`
// 			)
// 			return {
// 				user,
// 				ttl: userStat,
// 				date: now
// 			}
// 		})
// )

// const handleRecord = (record: any) => {

// }

// 	/**
// 	 *
// 	 * cc: Achievements Lambda#1; Beginning of the create/update Achievements Lambda; Receives an event parameters as array of Records
// 	 *
// 	 */

// export const handler: DynamoDBStreamHandler = async (event, context) => {
//     console.log('TCL: handler:DynamoDBStreamHandler -> event', event)
// 	const log = makeLogger({
// 		handler: 'onPlayUpdateAchievements',
// 		awsEvent: 'ddbs'
// 	})
// 	log.info(`${event.Records.length} records`)
// 	const env = verifyEnv(
// 		{
// 			DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
// 			TABLE_ACHIEVEMENT: process.env.TABLE_ACHIEVEMENT,
// 			TABLE_STAT: process.env.TABLE_STAT,
// 			TABLE_USER: process.env.TABLE_USER,
// 			QUEUE_VALIDATION_ERRORS: process.env.QUEUE_VALIDATION_ERRORS
// 		},
// 		log
// 	)

// 	/**
// 	 *
// 	 * cc:Achievements Lambda#2; Achievement Table Module; This is where we keep all of our logic regarding creating, updating and comparing achievements.
// 	 *
// 	 */

// 	const tableAchievement = TableAchievement(
// 		env.DYNAMO_ENDPOINT,
// 		env.TABLE_ACHIEVEMENT
// 	)
// 	const tableStat = TableStat(env.DYNAMO_ENDPOINT, env.TABLE_STAT)
// 	const tableUser = TableUser(env.DYNAMO_ENDPOINT, env.TABLE_USER)
// 	const filteredRecords: any = filterByArtistKeysOnly(event.Records)
// 	const allUsers: any = await tableUser.getAllSpotifyCreds()
// 	const { userKeys, artistKeys } = filteredRecords
// 		? retrieveArtistAndUserKeys(filteredRecords)
// 		: { userKeys: [], artistKeys: [] }
// 	const uniq: any = [...new Set(artistKeys.map(artist => artist.id.S))]

// 	if (uniq.length) {
// 		let topListenersByArtist = await Promise.all(
// 			uniq.map(async artistId => {
// 				const { valids } = allUsers
//                 console.log('TCL: handler:DynamoDBStreamHandler -> valids', valids)
// 				const artist = artistKeys.find(artist => artist.id.S === artistId)
// 				const usersWithStats: any = await getStatsForUsers(artist, artistId, valids, tableStat)

// 				let filtered = usersWithStats.filter(
// 					(listener: any) => listener.ttl !== 0
// 				)

// 				console.log('Existing top listeners filtered by non zero scores. There are currently ', filtered)

// 				if (filtered.length) {
// 					filtered = filtered.filter(
// 						listener =>
// 							filtered.indexOf(listener) ===
// 							filtered.lastIndexOf(listener)
// 					)
// 					if (filtered.length >= 3) {
// 						let [
// 							first = false,
// 							second = false,
// 							third = false
// 						] = _.sortBy(
// 							filtered,
// 							(listener: any) => listener.ttl
// 						).reverse()
// 						console.log('Three Top Listeners')

// 						if (first) {

// 							/*=============================================

// 							cc:Achievements Lambda#3; Function createOrModifyAchievement; This is responsible for creating achievement records in sync with the user's streaming behavior - as this function (and file at large)only fires when the Stats Table has been updated

// 							=============================================*/
// 							await tableAchievement.createOrModifyAchievement({
// 								artistId,
// 								achievementType: 'topListener',
// 								achievementValue: 'first',
// 								periodType: 'life',
// 								periodValue: 'life',
// 								date: first.currentTime,
// 								uid: first.user.uid,
// 								total: first.ttl,
// 								user: first.user
// 							})
// 						}
// 						if (second) {
// 							console.log('second place user returned from get user Stats: ', second)
// 							await tableAchievement.createOrModifyAchievement({
// 								artistId,
// 								achievementType: 'topListener',
// 								achievementValue: 'second',
// 								periodType: 'life',
// 								periodValue: 'life',
// 								date: second.currentTime,
// 								uid: second.user.uid,
// 								total: second.ttl,
// 								user: second.user
// 							})
// 						}
// 						if (third) {
// 							await tableAchievement.createOrModifyAchievement({
// 								artistId,
// 								achievementType: 'topListener',
// 								achievementValue: 'third',
// 								periodType: 'life',
// 								periodValue: 'life',
// 								date: third.currentTime,
// 								uid: third.user.uid,
// 								total: third.ttl,
// 								user: third.user
// 							})
// 						}
// 					}

// 					// @ts-ignore
// 					if (filtered.length === 2) {
// 						let [first = false, second = false] = _.sortBy(
// 							filtered,
// 							(listener: any) => listener.ttl
// 						).reverse()
// 						console.log('TCL: Two Top Listeners')

// 						if (first) {
// 							await tableAchievement.createOrModifyAchievement({
// 								artistId,
// 								achievementType: 'topListener',
// 								achievementValue: 'first',
// 								periodType: 'life',
// 								periodValue: 'life',
// 								date: first.currentTime,
// 								uid: first.user.uid,
// 								total: first.ttl,
// 								user: first.user
// 							})
// 						}
// 						if (second) {
// 							console.log('second place user returned from get user Stats: ', second)
// 							await tableAchievement.createOrModifyAchievement({
// 								artistId,
// 								achievementType: 'topListener',
// 								achievementValue: 'second',
// 								periodType: 'life',
// 								periodValue: 'life',
// 								date: second.currentTime,
// 								uid: second.user.uid,
// 								total: second.ttl
// 							})
// 						}
// 					}

// 					// @ts-ignore
// 					if (filtered.length === 1) {
// 						let [first] = filtered
// 						console.log('Only One Top Listener')
// 						if (first) {
// 							await tableAchievement.createOrModifyAchievement({
// 								artistId,
// 								achievementType: 'topListener',
// 								achievementValue: 'first',
// 								periodType: 'life',
// 								periodValue: 'life',
// 								date: first.currentTime,
// 								uid: first.user.uid,
// 								total: first.ttl,
// 								user: first.user
// 							})
// 						}
// 					}

// 					return _.sortBy(filtered, (listener: any) => listener.ttl)
// 				}
// 			})
// 		)
// 		console.log(
// 			'These are the listeners we have created new achievements for',
// 			topListenersByArtist
// 		)
// 	}

// 	log.close()
// }
