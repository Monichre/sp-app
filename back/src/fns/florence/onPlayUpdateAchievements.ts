import { DynamoDBStreamHandler, DynamoDBRecord, StreamRecord } from 'aws-lambda'
import { verifyEnv } from '../../shared/env'
import { makeLogger, TLogger } from '../logger'
import { TableStat } from '../../shared/tables/TableStat'
import { TableUser } from '../../shared/tables/TableUser'
import { TableAchievement } from '../../shared/tables/TableAchievement'
import { handleInvalid } from '../../shared/validation'
import winston = require('winston')
import * as moment from 'moment'

type Artist = {
  id?: string,
  name?: string,
}

const localizedMoment = (utcOffset: number, m: moment.Moment) =>
	moment.utc(m).utcOffset(utcOffset, false)

const localizedISOString = (m: moment.Moment) => m.toISOString(true)

type Env = {
	DYNAMO_ENDPOINT: string
	TABLE_ACHIEVEMENT: string
	TABLE_STAT: string
	TABLE_USER: string
	QUEUE_VALIDATION_ERRORS: string
}

// const handleRecord = async (env: Env, log: TLogger, record: DynamoDBRecord) => 

const returnArtistsToUpdate = async (env: Env, log: TLogger, record: DynamoDBRecord) => {
	const tableAchievement = TableAchievement(
		env.DYNAMO_ENDPOINT,
		env.TABLE_ACHIEVEMENT
	)
	const tableStat = TableStat(env.DYNAMO_ENDPOINT, env.TABLE_STAT)
	const tableUser = TableUser(env.DYNAMO_ENDPOINT, env.TABLE_USER)

	const {
		eventName,
		dynamodb: { Keys, NewImage }
	} = record

	log.info(Keys, NewImage)

	const { pk, sk } = Keys
	const { artist }: any = NewImage
	const artistId: any = artist ? artist.M.id.S : null
	const artistName = artist ? artist.M.name : null

	console.log('TCL: handleRecord -> artistId', artistId)
    console.log('TCL: handleRecord -> artistName', artistName)

	if (pk.S.includes('spotify')) {
		// if spotify key preceeds the uid then this is a user
		const userId = pk.S.split('#')[0]
		const user = await tableUser.getUser(userId)
		const { valid, invalid } = user

		if (invalid) {
			throw new Error(`user info invalid for uid ${userId}`)
		}

		const { utcOffset } = valid
		if (artistId && userId) {

		const artistStat = await tableStat.getArtistStat({
			uid: userId,
			artistId: artistId,
			periodType: 'life',
			periodValue: 'life'
		})
			
			console.log('TCL: handleRecord -> artistStat', artistStat)
		}
			
        

		const now = localizedMoment(utcOffset, moment())

		
	}

	// const KeySchema = {
	// 	sk: {
	// 		S: 'spotify:124053034#day#6zlR5ttMfMNmwf2lecU9Cc'
	// 	},
	// 	pk: {
	// 		S: 'spotify:124053034#artist#day#2019-07-12'
	// 	}
	// }

// 	if (eventName === 'INSERT') {
// 		// Should begin new achievement process if INSERT

// 		// const tablePlay = TablePlay(env.DYNAMO_ENDPOINT, '') // not actually writing anything, this is hacky af [Why??]
// 		// // const { valid, invalid } = tablePlay.decode(record.dynamodb.NewImage)

// 		// if (invalid) {
// 		// 	handleInvalid(log, env.QUEUE_VALIDATION_ERRORS, invalid.errors, {
// 		// 		handler: 'onPlayUpdateAchievements',
// 		// 		input: invalid.item
// 		// 	})
// 		// 	return
// 		// }
// 		// const { playedAt, track, uid } = valid
// 		// console.log('TCL: uid', uid)
// 		// console.log('TCL: track', track)
// 		// console.log('TCL: playedAt', playedAt)
// 		// const { duration_ms: playDurationMs } = track
// 		// log.info(`Updating Achievements under Artist: ${track.name}`)

// 		// const artists = track.artists
// 		// const { day, week, month } = tableAchievement.periodsFor(playedAt)
// 		// console.log('TCL: month', month)
// 		// console.log('TCL: week', week)
// 		// console.log('TCL: day', day)

// 		// for (const artist of artists) {
// 		// log.info('updating user and global stats for', {artist: artist.name})
// 		// await tableAchievement.writeAchievement({
// 		// 	artistId: artist.id,
// 		// 	achievementType: 'top',
// 		// 	periodType: 'day',
// 		// 	periodValue: day,
// 		// 	uid,
// 		// 	total: 0

// 		// })
// 		// await tableAchievement.writeAchievement({
// 		// 	artistId: artist.id,
// 		// 	achievementType: 'top',
// 		// 	periodType: 'week',
// 		// 	periodValue: week,
// 		// 	uid,
// 		// 	total: 0

// 		// })
// 		// await tableAchievement.writeAchievement({
// 		// 	artistId: artist.id,
// 		// 	achievementType: 'top',
// 		// 	periodType: 'month',
// 		// 	periodValue: month,
// 		// 	uid,
// 		// 	total: 0

// 		// })
// 		// await tableAchievement.writeAchievement({
// 		// 	artistId: artist.id,
// 		// 	achievementType: 'top',
// 		// 	periodType: 'life',
// 		// 	periodValue: 'life',
// 		// 	uid,
// 		// 	total: 0

// 		// })

// 		// await tableAchievement.writeAchievement({
// 		// 	artistId: artist.id,
// 		// 	achievementType: 'top',
// 		// 	periodType: 'day',
// 		// 	periodValue: day,
// 		// 	uid: 'global',
// 		// 	total: 0

// 		// })
// 		// await tableAchievement.writeAchievement({
// 		// 	artistId: artist.id,
// 		// 	achievementType: 'top',
// 		// 	periodType: 'week',
// 		// 	periodValue: week,
// 		// 	uid: 'global',
// 		// 	total: 0

// 		// })
// 		// await tableAchievement.writeAchievement({
// 		// 	artistId: artist.id,
// 		// 	achievementType: 'top',
// 		// 	periodType: 'month',
// 		// 	periodValue: month,
// 		// 	uid: 'global',
// 		// 	total: 0

// 		// })
// 		// await tableAchievement.writeAchievement({
// 		// 	artistId: artist.id,
// 		// 	achievementType: 'top',
// 		// 	periodType: 'life',
// 		// 	periodValue: 'life',
// 		// 	uid: 'global',
// 		// 	total: 0

// 		// })
// 		// }

// 		return
// 	}
// 	if (eventName === 'REMOVE') {
// 		log.info('Removed Stat')
// 		return
// 	}
// 	if (eventName === 'MODIFY') {
// 		// TODO: Create logic to tally playDuration totals and calc top listeners
// 		log.warn('modified Stats record, keys modified: ', { Keys })
// 		return
// 	}
// 	log.warn('unknown event', { eventName, Keys })
// }

export const handler: DynamoDBStreamHandler = async (event, context) => {
	const log = makeLogger({
		handler: 'onPlayUpdateAchievements',
		awsEvent: 'ddbs'
	})
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
	log.info(`${event.Records.length} records`)

	/*
		Event.Records will contain both genre stats and artist stats. At the moment we are not concerned with genre stats so we will filter by making sure the record has an 'artist' key on the record object

		...
		
	*/

	const filteredRecords: any = filterByArtistStatsOnly(event.Records)
    console.log('TCL: handler:DynamoDBStreamHandler -> filteredRecords', filteredRecords)

	if (filteredRecords.length) {
		const achievements = await Promise.all(filteredRecords.map(async record => {
			const data = await (record)
		}))
	}
	// const artistStatRecords: any = await Promise.all(
	// 	event.Records.map(record => {
	// 		handleRecord(env, log, record)
	// 	})
	// )
	// this does not seem to be working...

	log.close()
}

const filterByArtistStatsOnly = records =>
	records.filter(record => record.dynamodb.NewImage.artist ? record : false)

