import { DynamoDBStreamHandler, DynamoDBRecord, StreamRecord } from 'aws-lambda'
import { verifyEnv } from '../../shared/env'
import { makeLogger, TLogger } from '../logger'
import { TableStat } from '../../shared/tables/TableStat'
import { TableUser } from '../../shared/tables/TableUser'
import { TableAchievement } from '../../shared/tables/TableAchievement'
import * as _ from 'lodash'
import * as moment from 'moment'

type Artist = {
	id?: string
	name?: string
}

const localizedMoment = (utcOffset: number, m: moment.Moment) =>
	moment.utc(m).utcOffset(utcOffset, false).format('YYYY-MM-DD')

const localizedISOString = (m: moment.Moment) => m.toISOString(true)

type Env = {
	DYNAMO_ENDPOINT: string
	TABLE_ACHIEVEMENT: string
	TABLE_STAT: string
	TABLE_USER: string
	QUEUE_VALIDATION_ERRORS: string
}
const filterByArtistKeysOnly = records =>
	records.filter(record => (record.dynamodb.NewImage.artist ? record : false))

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
	const filteredRecords: any = filterByArtistKeysOnly(event.Records)
	const allUsers: any = await tableUser.getAllSpotifyCreds()
	const { userKeys, artistKeys } = filteredRecords
		? retrieveArtistAndUserKeys(filteredRecords)
		: { userKeys: [], artistKeys: [] }
	const uniq: any = [...new Set(artistKeys.map(artist => artist.id.S))]

	if (uniq.length) {
		let topListenersByArtist = await Promise.all(
			uniq.map(async artistId => {
				const { valids } = allUsers
				const artist = artistKeys.find(artist => artist.id.S === artistId)
				const topListeners = await Promise.all(
					valids.map(async (user: any) => {
						const { valid, utcOffset } = user

						const now = localizedMoment(utcOffset, moment())

						const userStat = await tableStat.getArtistStat({
							uid: user.uid,
							artistId: artistId,
							periodType: 'life',
							periodValue: 'life'
						})
						const userHandle = user.displayName ? user.displayName : user.email

						https: console.log(
							'User: ',
							userHandle,
							`Total Time Listened for artist ${
								artist.name.S
							}: ${userStat} milleseconds`
						)
						return {
							user,
							ttl: userStat,
							date: now
						}
					})
				)
				const filtered = topListeners.filter(
					(listener: any) => listener.ttl !== 0
				)

				if (filtered.length) {
					if (filtered.length > 2) {
						let [first, second, third] = _.sortBy(
							filtered,
							(listener: any) => listener.ttl
						).reverse()
						console.log('TCL: first', first)
						console.log('TCL: second', second)
						console.log('TCL: third', third)
						if (first) {
							await tableAchievement.writeAchievement({
								artistId,
								achievementType: 'topListener',
								achievementValue: 'first',
								periodType: 'life',
								periodValue: 'life',
								date: first.date,
								uid: first.user.uid,
								total: first.ttl,
								user: first.user
							})
						}
						if (second) {
							await tableAchievement.writeAchievement({
								artistId,
								achievementType: 'topListener',
								achievementValue: 'second',
								periodType: 'life',
								periodValue: 'life',
								date: second.date,
								uid: second.user.uid,
								total: second.ttl,
								user: second.user
							})
						}
					}

					// @ts-ignore
					if (filtered.length === 2) {
						let [first, second] = _.sortBy(
							filtered,
							(listener: any) => listener.ttl
						).reverse()
						console.log('TCL: first', first)
						console.log('TCL: second', second)
						

						if (first) {
							await tableAchievement.writeAchievement({
								artistId,
								achievementType: 'topListener',
								achievementValue: 'first',
								periodType: 'life',
								periodValue: 'life',
								date: first.date,
								uid: first.user.uid,
								total: first.ttl,
								user: first.user
							})
						}
						if (second) {
							await tableAchievement.writeAchievement({
								artistId,
								achievementType: 'topListener',
								achievementValue: 'second',
								periodType: 'life',
								periodValue: 'life',
								date: second.date,
								uid: second.user.uid,
								total: second.ttl
							})
						}
					}

					// @ts-ignore
					if (filtered.length === 1) {
						let [first] = _.sortBy(
							filtered,
							(listener: any) => listener.ttl
						).reverse()
						console.log('TCL: first', first)
						if (first) {
							await tableAchievement.writeAchievement({
								artistId,
								achievementType: 'topListener',
								achievementValue: 'first',
								periodType: 'life',
								periodValue: 'life',
								date: first.date,
								uid: first.user.uid,
								total: first.ttl,
								user: first.user
							})
						}
					}

					return _.sortBy(filtered, (listener: any) => listener.ttl)
				}
			})
		)
		const flat = topListenersByArtist.flat().sort()
		console.log('TCL: flat', flat)
	}

	log.close()
}
