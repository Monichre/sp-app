import { DynamoDBStreamHandler } from 'aws-lambda'
import { verifyEnv } from '../../shared/env'
import { makeLogger } from '../logger'
import { TableStat } from '../../shared/tables/TableStat'
import * as _ from 'lodash'
import {  ArtistImage } from '../../shared/SharedTypes';
import { calculateAchievementsTimeSeries } from '../agl/functions';

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
	
	const tableStat = TableStat(env.DYNAMO_ENDPOINT, env.TABLE_STAT)
	
	const handleRecord = async (record: any) => {
		const {
			dynamodb: { NewImage }
		} = record

		const { artist } = NewImage
		const artistInfo: any = artist
			? await tableStat.getArtistInfo(artist.M.id.S)
			: null

		if (artist && artistInfo) {

			await calculateAchievementsTimeSeries({ artistId: artistInfo.id })
		
		}
	}

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

	log.close()
}
