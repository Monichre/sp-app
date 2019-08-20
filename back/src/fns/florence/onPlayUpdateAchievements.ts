import { DynamoDBStreamHandler, DynamoDBRecord, StreamRecord } from 'aws-lambda'
import { verifyEnv } from '../../shared/env'
import { makeLogger, TLogger } from '../logger'
import { TableStat } from '../../shared/tables/TableStat'
import { TableUser } from '../../shared/tables/TableUser'
import { TableAchievement } from '../../shared/tables/TableAchievement'
import * as fs from 'fs'

import {
	bulkRecordUserAchievements,
	extractKeys,
	localizedMoment,
	organizeUserStatsByPeriod
} from '../agl/functions'
import * as _ from 'lodash'
import moment = require('moment')

type GenreImage = {
	genre: { S: string }
	sk: { S: string }
	pk: { S: string }
	playDurationMs: { N: string }
}

type ArtistImage = {
	artist: {
		M: {
			images: any[]
			genres: any[]
			name: any[]
			id: any[]
			external_urls: any[]
		}
	}
	sk: {
		S: string
	}
	pk: {
		S: string
	}
	playDurationMs: {
		N: string
	}
}

const isArtistOrGlobal = NewImage => (NewImage.artist ? 'artist' : 'global')

/**
 *
 * cc: Achievements Lambda#1; Beginning of the create/update Achievements Lambda; Receives an event parameters as array of Records
 *
 */

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
	const allUsers: any = await tableUser.getAllSpotifyCreds()
	const { valids } = allUsers

	const handleRecord = async (record: any) => {
		const {
			dynamodb: { Keys, ApproximateCreationDateTime, NewImage }
		} = record

		const { artist } = NewImage
		const artistInfo = artist
			? await tableStat.getArtistInfo(artist.M.id.S)
			: null

	
		const recordKeys = extractKeys(Keys)


		if (artist && artistInfo) {
			const {
				byDay,
				byWeek,
				byMonth,
				byLifetime
			}: any = await organizeUserStatsByPeriod(
				valids,
				artistInfo,
				ApproximateCreationDateTime,
				tableStat,
				tableAchievement
				)
			
			

			console.log('byDay', byDay)
			
			console.log('byWeek.length', byWeek)
			console.log('byMonth.length', byMonth)
			console.log('byLifetime.length', byLifetime)

			let dailyTopAchievers 
			let weeklyTopAchievers 
			let monthlyTopAchievers 
			let lifetimeTopAchievers 

			if(byDay){
				dailyTopAchievers = byDay.length ? await bulkRecordUserAchievements(
					byDay,
					artistInfo,
					recordKeys,
					tableAchievement
				) : null
				console.log('TCL: handleRecord -> dailyTopAchievers', dailyTopAchievers)

			}
				if(byWeek){
					weeklyTopAchievers = byWeek.length ? await bulkRecordUserAchievements(
						byWeek,
						artistInfo,
						recordKeys,
						tableAchievement
					) : null
					console.log('TCL: handleRecord -> weeklyTopAchievers', weeklyTopAchievers)
				}

				if(byMonth){
					monthlyTopAchievers = byMonth.length ? await bulkRecordUserAchievements(
						byMonth,
						artistInfo,
						recordKeys,
						tableAchievement
					) : null
				}

				if(byLifetime){
					lifetimeTopAchievers = byLifetime.length ? await bulkRecordUserAchievements(
						byLifetime,
						artistInfo,
						recordKeys,
						tableAchievement
					) : null

				}


		
			return {
				dailyTopAchievers,
				weeklyTopAchievers,
				monthlyTopAchievers,
				lifetimeTopAchievers
			}
		}
	}

	// close the stream

	const artistEventStreams: ArtistImage[] = event.Records.filter(
		(record: any) => {
			const {
				dynamodb: { Keys, ApproximateCreationDateTime, NewImage }
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

	const genreEventStreams: GenreImage[] = event.Records.filter(
		({ dynamodb: { Keys, ApproximateCreationDateTime, NewImage } }) =>
			NewImage.genre && NewImage.pk.S.includes('spotify')
	)


	log.close()
}
