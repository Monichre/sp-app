import { DynamoDBStreamHandler, DynamoDBRecord, StreamRecord } from 'aws-lambda'
import { verifyEnv } from '../../shared/env'
import { makeLogger, TLogger } from '../logger'
import { TableStat } from '../../shared/tables/TableStat'
import { TablePlay } from '../../shared/tables/TablePlay'
import { TableAchievement } from '../../shared/tables/TableAchievement'
import { handleInvalid } from '../../shared/validation'
import winston = require('winston')


// const log = slog.child({handler: 'onPlayUpdateAchievements', awsEvent: 'ddbs'})

type Env = {
	DYNAMO_ENDPOINT: string
	TABLE_ACHIEVEMENT: string
	QUEUE_VALIDATION_ERRORS: string
}

const handleRecord = (env: Env, log: TLogger) => async (
	record: DynamoDBRecord
) => {

	console.log('TCL: handleRecord -> Stat record in Achievement Handler: ', record)
	const {
		eventName,
		dynamodb: { Keys, NewImage }
	} = record

	log.info(eventName, Keys, NewImage)



// const KeySchema = {
// 	sk: {
// 		S: 'spotify:124053034#day#6zlR5ttMfMNmwf2lecU9Cc'
// 	},
// 	pk: {
// 		S: 'spotify:124053034#artist#day#2019-07-12'
// 	}
// }

	
	if (eventName === 'INSERT') {
		// Should begin new achievement process if INSERT
		
		const tableAchievement = TableAchievement(
			env.DYNAMO_ENDPOINT,
			env.TABLE_ACHIEVEMENT
        )
        
		// const tablePlay = TablePlay(env.DYNAMO_ENDPOINT, '') // not actually writing anything, this is hacky af [Why??]
		// // const { valid, invalid } = tablePlay.decode(record.dynamodb.NewImage)

		// if (invalid) {
		// 	handleInvalid(log, env.QUEUE_VALIDATION_ERRORS, invalid.errors, {
		// 		handler: 'onPlayUpdateAchievements',
		// 		input: invalid.item
		// 	})
		// 	return
		// }
		// const { playedAt, track, uid } = valid
        // console.log('TCL: uid', uid)
        // console.log('TCL: track', track)
        // console.log('TCL: playedAt', playedAt)
		// const { duration_ms: playDurationMs } = track
		// log.info(`Updating Achievements under Artist: ${track.name}`)

		// const artists = track.artists
		// const { day, week, month } = tableAchievement.periodsFor(playedAt)
        // console.log('TCL: month', month)
        // console.log('TCL: week', week)
        // console.log('TCL: day', day)

		// for (const artist of artists) {
			// log.info('updating user and global stats for', {artist: artist.name})
			// await tableAchievement.writeAchievement({
			// 	artistId: artist.id,
			// 	achievementType: 'top',
			// 	periodType: 'day',
			// 	periodValue: day,
			// 	uid,
			// 	total: 0
				
			// })
			// await tableAchievement.writeAchievement({
			// 	artistId: artist.id,
			// 	achievementType: 'top',
			// 	periodType: 'week',
			// 	periodValue: week,
			// 	uid,
			// 	total: 0
				
			// })
			// await tableAchievement.writeAchievement({
			// 	artistId: artist.id,
			// 	achievementType: 'top',
			// 	periodType: 'month',
			// 	periodValue: month,
			// 	uid,
			// 	total: 0
				
			// })
			// await tableAchievement.writeAchievement({
			// 	artistId: artist.id,
			// 	achievementType: 'top',
			// 	periodType: 'life',
			// 	periodValue: 'life',
			// 	uid,
			// 	total: 0
				
			// })

			// await tableAchievement.writeAchievement({
			// 	artistId: artist.id,
			// 	achievementType: 'top',
			// 	periodType: 'day',
			// 	periodValue: day,
			// 	uid: 'global',
			// 	total: 0
				
			// })
			// await tableAchievement.writeAchievement({
			// 	artistId: artist.id,
			// 	achievementType: 'top',
			// 	periodType: 'week',
			// 	periodValue: week,
			// 	uid: 'global',
			// 	total: 0
				
			// })
			// await tableAchievement.writeAchievement({
			// 	artistId: artist.id,
			// 	achievementType: 'top',
			// 	periodType: 'month',
			// 	periodValue: month,
			// 	uid: 'global',
			// 	total: 0
				
			// })
			// await tableAchievement.writeAchievement({
			// 	artistId: artist.id,
			// 	achievementType: 'top',
			// 	periodType: 'life',
			// 	periodValue: 'life',
			// 	uid: 'global',
			// 	total: 0
				
			// })
		// }

		return
	}
	if (eventName === 'REMOVE') {
		log.info('Removed Stat')
		return
	}
	if (eventName === 'MODIFY') {
		// TODO: Create logic to tally playDuration totals and calc top listeners
		log.warn('modified Stats record, keys modified: ', { Keys })
		return
	}
	log.warn('unknown event', { eventName, Keys })
}


export const handler: DynamoDBStreamHandler = async (event, context) => {
	const log = makeLogger({
		handler: 'onPlayUpdateAchievements',
		awsEvent: 'ddbs'
	})
	const env = verifyEnv(
		{
			DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
			TABLE_ACHIEVEMENT: process.env.TABLE_ACHIEVEMENT,
			QUEUE_VALIDATION_ERRORS: process.env.QUEUE_VALIDATION_ERRORS
		},
		log
	)
	log.info(`${event.Records.length} records`)

	/*
		Event.Records will contain both genre stats and artist stats. At the moment we are not concerned with genre stats so we will filter by making sure the record has an 'artist' key on the record object

		...
		
	*/
	const artistStatRecords = event.Records.filter(
		(record: any) =>
			Object.keys(record).includes('NewImage') &&
			Object.keys(record.NewImage).includes('artist')
	)
	// this does not seem to be working...
	console.log(
		'TCL: handler:DynamoDBStreamHandler -> artistStatRecords filtered out genres: ',
		artistStatRecords
	)

	await Promise.all(artistStatRecords.map(handleRecord(env, log))) // The record per iteration is passed implicitly
	log.close()
}
    
