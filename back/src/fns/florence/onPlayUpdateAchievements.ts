import { DynamoDBStreamHandler, DynamoDBRecord, StreamRecord } from 'aws-lambda'
import { verifyEnv } from '../../shared/env'
import { makeLogger, TLogger } from '../logger'
import { TableStat } from '../../shared/tables/TableStat'
import { TableUser } from '../../shared/tables/TableUser'
import { TableAchievement } from '../../shared/tables/TableAchievement'
import {
	getDailyTopAchievers,
	getWeeklyTopAchievers,
	getMonthlyTopAchievers,
	getLifetimeTopAchievers,
	extractKeys
} from '../agl/functions'
import * as _ from 'lodash'

const isArtistOrGlobal = NewImage => (NewImage.artist ? 'artist' : 'global')

/**
 *
 * cc: Achievements Lambda#1; Beginning of the create/update Achievements Lambda; Receives an event parameters as array of Records
 *
 */

export const handler: DynamoDBStreamHandler = async (event, context) => {
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

		console.log('TCL: handleRecord -> NewImage', NewImage)

		const { artist } = NewImage
		const artistInfo = artist
			? await tableStat.getArtistInfo(artist.M.id.S)
			: null

		console.log('TCL: handleRecord -> artist', artist)
		console.log('TCL: handleRecord -> artistInfo', artistInfo)

		const { day, week, month, life } = tableAchievement.periodsFor(
			ApproximateCreationDateTime
		)

		const typeOfStat = isArtistOrGlobal(NewImage)
        console.log('TCL: handleRecord -> typeOfStat', typeOfStat)
		const recordKeys = extractKeys(Keys)
		const lastUpdated = ApproximateCreationDateTime
		

		/**
		 *
		 * cc: tableStat #2; Function getArtistStat
		 *
		 */
		if (typeOfStat === 'artist' && artist && artistInfo) {
			const userData = await Promise.all(
				valids.map(async (user: any) => {
					const dayData = await tableStat.getArtistStat({
						uid: user.uid,
						artistId: artistInfo.id,
						periodType: 'day',
						periodValue: day
					})
					console.log('TCL: handleRecord -> dayData', dayData)
					const weekData = await tableStat.getArtistStat({
						uid: user.uid,
						artistId: artistInfo.id,
						periodType: 'week',
						periodValue: week
					})
					console.log('TCL: handleRecord -> weekData Artist', weekData)
					const monthData = await tableStat.getArtistStat({
						uid: user.uid,
						artistId: artistInfo.id,
						periodType: 'month',
						periodValue: month
					})
					const lifeData = await tableStat.getArtistStat({
						uid: user.uid,
						artistId: artistInfo.id,
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
			
			/**
			 *
			 * cc: Daily Achievement Creation
			 *
			 */

			const dailyTopAchievers = await getDailyTopAchievers(dailyTops, artistInfo, tableAchievement,lastUpdated) 

			/**
			 *
			 * cc: Weekly Achievement Creation
			 *
			 */

			const weeklyTopAchievers = await getWeeklyTopAchievers(weeklyTops, artistInfo, tableAchievement,lastUpdated)

			/**
			 *
			 * cc: Monthly Achievement Creation
			 *
			 */

			const monthlyTopAchievers = await getMonthlyTopAchievers(
				monthlyTops,
				artistInfo,
				tableAchievement,
				lastUpdated)
			
			/**
			 *
			 * cc: Lifetime Achievement Creation
			 *
			 */

			const lifetimeTopAchievers = await getLifetimeTopAchievers(
				lifetimeTops,
				artistInfo,
				tableAchievement,
				lastUpdated
			)

			return {
				dailyTopAchievers,
				weeklyTopAchievers,
				monthlyTopAchievers,
				lifetimeTopAchievers
			}


		} 
	}

	await Promise.all(
		event.Records.map(async record => await handleRecord(record))
	)

	log.close()
}
