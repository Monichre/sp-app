import { DynamoDBStreamHandler, DynamoDBRecord, StreamRecord } from 'aws-lambda'
import { verifyEnv } from '../../shared/env'
import { makeLogger, TLogger } from '../logger'
import { TableStat } from '../../shared/tables/TableStat'
import { TableUser } from '../../shared/tables/TableUser'
import { TableAchievement } from '../../shared/tables/TableAchievement'
import {ArtistAndGenreLeaders} from '../agl/AGL'
import * as _ from 'lodash'
import moment = require('moment')
import { AchievementRecord, ArtistImage } from '../../shared/SharedTypes';

export const handler: DynamoDBStreamHandler | any = async (event, context) => {
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
	const AGL = new ArtistAndGenreLeaders()

	const handleRecord = async (record: any) => {
		const {
			dynamodb: { ApproximateCreationDateTime, NewImage }
		} = record

		const { artist } = NewImage
		const artistInfo: any = artist
			? await tableStat.getArtistInfo(artist.M.id.S)
			: null

		const { day, week, month, life } = tableAchievement.periodsFor(
			ApproximateCreationDateTime
		)

		const findValidUser = async (arr: any) => {
			const newArr = await Promise.all(
				arr.map(async (topListenerData: any) => {
					const {valid: user} = await tableUser.getUser(topListenerData.userId)

					const {
						pk,
						sk,
						artist,
						artistAchievementsId,
						total
					} = topListenerData
					const localizedMoment = (utcOffset: number, m: moment.Moment) =>
						moment.utc(m).utcOffset(utcOffset, false)

					// const localizedISOString = (m: moment.Moment) => m.toISOString(true)

					const { utcOffset }: any = user
					const lastUpdated = localizedMoment(utcOffset, moment()).format(
						'MMMM Do YYYY, h:mm:ss a'
					)

					return {
						pk,
						sk,
						artist,
						artistAchievementsId,
						total,
						user,
						lastUpdated
					}
				})
			)

			return newArr
		}

		if (artist && artistInfo) {
			const artistAchievementsIdDay = `${artistInfo.id}#day#${day}#user`
			const artistAchievementsIdWeek = `${artistInfo.id}#week#${week}#user`
			const artistAchievementsIdMonth = `${artistInfo.id}#month#${month}#user`
			const artistAchievementsIdLife = `${artistInfo.id}#life#life#user`

			const dayData = await tableStat.getArtistTopListeners(
				artistAchievementsIdDay
			)
			const weekData = await tableStat.getArtistTopListeners(
				artistAchievementsIdWeek
			)
			const monthData = await tableStat.getArtistTopListeners(
				artistAchievementsIdMonth
			)
			const lifeData = await tableStat.getArtistTopListeners(
				artistAchievementsIdLife
			)

			if (dayData) {
				await findValidUser(dayData).then(
					async (res: any) => {
						return await Promise.all(
							res.map(async (topListenerData: any, index: number) => {
								const d: AchievementRecord = await AGL.enrichAndRecordAchievement(
									topListenerData,
									index,
									tableAchievement
								)
								console.log('TCL: handleRecord -> d ', d)
								return d
							})
						)
					}
				)
			}

			if (weekData) {
				await findValidUser(weekData).then(
					async (res: any) => {
						return await Promise.all(
							res.map(async (topListenerData: any, index: number) => {
								const d: AchievementRecord = await AGL.enrichAndRecordAchievement(
									topListenerData,
									index,
									tableAchievement
								)
								console.log('TCL: handleRecord -> d ', d)
								return d
							})
						)
					}
				)
			}

			if (monthData) {
				await findValidUser(monthData).then(
					async (res: any) => {
						return await Promise.all(
							res.map(async (topListenerData: any, index: number) => {
								const d: AchievementRecord = await AGL.enrichAndRecordAchievement(
									topListenerData,
									index,
									tableAchievement
								)
								console.log('TCL: handleRecord -> d ', d)
								return d
							})
						)
					}
				)
			}

			if (lifeData) {
				await findValidUser(lifeData).then(
					async (res: any) => {
						return await Promise.all(
							res.map(async (topListenerData: any, index: number) => {
								const d: AchievementRecord = await AGL.enrichAndRecordAchievement(
									topListenerData,
									index,
									tableAchievement
								)
								console.log('TCL: handleRecord -> d ', d)
								return d
							})
						)
					}
				)
			}

		}
	}

	// close the stream

	const artistEventStreams: ArtistImage[] = event.Records.filter(
		(record: any) => {
			const {
				dynamodb: { NewImage }
			} = record

			if (NewImage.artist && NewImage.pk.S.includes('spotify')) {
				return record
			}
		}
	)

	if (artistEventStreams.length) {
		await Promise.all(
			artistEventStreams.map(async record => await handleRecord(record))
		)
	}

	// const genreEventStreams: GenreImage[] = event.Records.filter(
	// 	({ dynamodb: { Keys, ApproximateCreationDateTime, NewImage } }) =>
	// 		NewImage.genre && NewImage.pk.S.includes('spotify')
	// )

	log.close()
}
