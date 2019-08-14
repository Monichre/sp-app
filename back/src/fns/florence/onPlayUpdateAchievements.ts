import { DynamoDBStreamHandler, DynamoDBRecord, StreamRecord } from 'aws-lambda'
import { verifyEnv } from '../../shared/env'
import { makeLogger, TLogger } from '../logger'
import { TableStat } from '../../shared/tables/TableStat'
import { TableUser } from '../../shared/tables/TableUser'
import { TableAchievement } from '../../shared/tables/TableAchievement'
import * as _ from 'lodash'

type Env = {
	DYNAMO_ENDPOINT: string
	TABLE_ACHIEVEMENT: string
	TABLE_STAT: string
	TABLE_USER: string
	QUEUE_VALIDATION_ERRORS: string
}

const isArtistOrGlobal = NewImage => (NewImage.artist ? 'artist' : 'global')

const getGlobalStatForUser = async (user, periodType, periodValue, tableStat) =>
	await tableStat.getStat({
		uid: user.uid,
		periodType,
		periodValue
	})

const extractKeys = ({ pk, sk }) => ({
	pk: pk.S,
	sk: sk.S
})

const extractPeriodTypeAndValue = ({ pk, sk }) => {
	const split = pk.split('#')
	const end = split.length - 1

	const periodType = split[end - 1]
	const periodValue = split[end]

	return {
		periodType,
		periodValue
	}
}

const makeKeys = ({ recordKeys, achievementType, achievementValue, uid }) => {
	const { pk, sk } = recordKeys

	return {
		pk: `${pk}#${achievementType}#${achievementValue}`,
		sk: `${sk}#${achievementType}#${achievementValue}`,
		fk: `#${achievementType}#${achievementValue}#${uid}`
	}
}

const keyMaker = args => [...args].join('#')



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

	const handleRecord = async (record: any) => {
		const {
			dynamodb: { Keys, ApproximateCreationDateTime, NewImage }
		} = record

		const { day, week, month, life } = tableAchievement.periodsFor(
			ApproximateCreationDateTime
		)
	
		const typeOfStat = isArtistOrGlobal(NewImage)
		const indexToAchievementMap = {
			0: 'first',
			1: 'second',
			2: 'third'
		}
		const recordKeys = extractKeys(Keys)
		const lastUpdated = ApproximateCreationDateTime

		if (typeOfStat === 'artist') {
			const { artist } = NewImage

			const userData = await Promise.all(
				valids.map(async (user: any) => {

					/**
					 *
					 * cc: tableStat #2; Function getArtistStat
					 *
					 */

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

			const dailyTops = _.sortBy(userData, d => d.dayData)
				.reverse()
				.filter(d => d.dayData > 0)
			const weeklyTops = _.sortBy(userData, d => d.weekData)
				.reverse()
				.filter(d => d.weekData > 0)
			const monthlyTops = _.sortBy(userData, d => d.monthData)
				.reverse()
				.filter(d => d.monthData > 0)
			const lifetimeTops = _.sortBy(userData, d => d.lifeData)
				.reverse()
				.filter(d => d.lifeData > 0)

			const dailyTopAchievers = dailyTops.length
				? await Promise.all(
						dailyTops.map(async (daily, index) => {
							console.log('TCL: handleRecord -> index', index)
							if (index <= 2) {
								const { recordKeys, user, dayData } = daily
								const achievementType = 'topListener'
								const achievementValue = indexToAchievementMap[index]
								const { uid } = user
								const total = dayData

								console.log('TCL: handleRecord -> dayData', dayData)
								const keyData = makeKeys({
									recordKeys,
									achievementType,
									achievementValue,
									uid
								})
								const newAchievement = await tableAchievement.createOrModifyAchievement(
									{
										keyData,
										total,
										lastUpdated,
										user,
										artist: {...artist.M}
									}
								)
								console.log(
									'TCL: handleRecord -> newAchievement',
									newAchievement
								)
							}
						})
				  )
				: null

			/**
			 *
			 * Weekly Achievement Creation
			 *
			 */

			const weeklyTopAchievers = weeklyTops.length
				? await Promise.all(
						weeklyTops.map(async (weekly, index) => {
							console.log('TCL: handleRecord -> index', index)
							if (index <= 2) {
								const { recordKeys, user, weekData } = weekly
								const achievementType = 'topListener'
								const achievementValue = indexToAchievementMap[index]
								const { uid } = user
								const total = weekData

								console.log('TCL: handleRecord -> weekData', weekData)

								const keyData = makeKeys({
									recordKeys,
									achievementType,
									achievementValue,
									uid
								})

								const newAchievement = await tableAchievement.createOrModifyAchievement(
									{
										keyData,
										total,
										lastUpdated,
										user,
										artist: { ...artist.M }
									}
								)
								console.log(
									'TCL: handleRecord -> newAchievement',
									newAchievement
								)
							}
						})
				  )
				: null

			/**
			 *
			 * Weekly Achievement Creation
			 *
			 */

			const monthlyTopAchievers = monthlyTops.length
				? await Promise.all(
						monthlyTops.map(async (monthly, index) => {
							console.log('TCL: handleRecord -> index', index)
							if (index <= 2) {
								const { recordKeys, user, monthData } = monthly
								const achievementType = 'topListener'
								const achievementValue = indexToAchievementMap[index]
								const { uid } = user
								const total = monthData

								console.log('TCL: handleRecord -> monthData', monthData)

								const keyData = makeKeys({
									recordKeys,
									achievementType,
									achievementValue,
									uid
								})

								const newAchievement = await tableAchievement.createOrModifyAchievement(
									{
										keyData,
										total,
										lastUpdated,
										user,
										artist: { ...artist.M }
									}
								)
								console.log(
									'TCL: handleRecord -> newAchievement',
									newAchievement
								)
							}
						})
				  )
				: null

			const lifetimeTopAchievers = lifetimeTops.length
				? await Promise.all(
						lifetimeTops.map(async (lifetime, index) => {
							console.log('TCL: handleRecord -> index', index)
							if (index <= 2) {
								const { recordKeys, user, lifeData } = lifetime
								const achievementType = 'topListener'
								const achievementValue = indexToAchievementMap[index]
								const { uid } = user
								const total = lifeData

								console.log('TCL: handleRecord -> monthData', lifeData)

								const keyData = makeKeys({
									recordKeys,
									achievementType,
									achievementValue,
									uid
								})

								const newAchievement = await tableAchievement.createOrModifyAchievement(
									{
										keyData,
										total,
										lastUpdated,
										user,
										artist: { ...artist.M }
									}
								)
								console.log(
									'TCL: handleRecord -> newAchievement',
									newAchievement
								)
							}
						})
				  )
				: null

			return {
				dailyTopAchievers,
				weeklyTopAchievers,
				monthlyTopAchievers,
				lifetimeTopAchievers
			}
		} else {

			
			/**
			 *
			 * Unused code for performing same achievement logic for general music listening volume
			 *
			 */
			
			
			// const userData = await Promise.all(
			// 	valids.map(async (user: any) => {
			// 		const dayData = await tableStat.getStat({
			// 			uid: user.uid,
			// 			periodType: 'day',
			// 			periodValue: day
			// 		})
			// 		const weekData = await tableStat.getStat({
			// 			uid: user.uid,
			// 			periodType: 'week',
			// 			periodValue: week
			// 		})
			// 		const monthData = await tableStat.getStat({
			// 			uid: user.uid,
			// 			periodType: 'month',
			// 			periodValue: month
			// 		})
			// 		const lifeData = await tableStat.getStat({
			// 			uid: user.uid,
			// 			periodType: 'life',
			// 			periodValue: life
			// 		})
			// 		return {
			// 			recordKeys,
			// 			user,
			// 			dayData,
			// 			weekData,
			// 			monthData,
			// 			lifeData
			// 		}
			// 	})
			// )
			// const dailyTops = _.sortBy(userData, d => d.dayData).reverse()
			// const weeklyTops = _.sortBy(userData, d => d.weekData).reverse()
			// const monthlyTops = _.sortBy(userData, d => d.monthData).reverse()
			// const lifetimeTops = _.sortBy(userData, d => d.lifeData).reverse()
			// return userData
		}
	}


	await Promise.all(
		event.Records.map(async record => await handleRecord(record))
	)

	log.close()
}
