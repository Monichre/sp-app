import { DynamoDBStreamHandler, DynamoDBRecord, StreamRecord } from 'aws-lambda'
import { verifyEnv } from '../../shared/env'
import { makeLogger, TLogger } from '../logger'
import { TableStat } from '../../shared/tables/TableStat'
import { TableUser } from '../../shared/tables/TableUser'
import { TableAchievement } from '../../shared/tables/TableAchievement'
import * as _ from 'lodash'
import * as moment from 'moment'

// cc:Achievement Current Time Key/Attribute#1;Moment Object v String;+5;This will be used as the metric to sort/filter achievements (sk and fk keys on the Achievements Table). This is localized
const localizedMoment = (utcOffset: number, m: moment.Moment) =>
	moment
		.utc(m)
		.utcOffset(utcOffset, false)
		.format()
// cc:This isn't being used but probably should be
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

// cc: This function gets the user's total time listened value by artist id; Extract this out
const getUserStat = async (user, artistId, tableStat) =>
	await tableStat.getArtistStat({
		uid: user.uid,
		artistId: artistId,
		periodType: 'life',
		periodValue: 'life'
	})

	// cc: Extract this out
const getStatsForUsers = async (artist, artistId, users, tableStat) =>  await Promise.all(
		users.map(async (user: any) => {
        console.log('TCL: user', user)
			const { utcOffset } = user
			const now = localizedMoment(utcOffset, moment())
			const userStat = await getUserStat(user, artistId, tableStat)
			const userHandle = user.displayName ? user.displayName : user.email

			console.log(
				'User: ',
				userHandle,
				`Total Time Listened for artist ${
					artist.name.S
				}: ${userStat} milleseconds`
			)
			return {
				user,
				ttl: userStat,
				currentTime: now
			}
		})
	)

	// cc:Achievements Lambda#1; The beginning of the create/update Achievements Lambda logic; This receives an event parameters with an array of Records on it
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

	// cc:Achievements Lambda#2; Achievement Table Module; This is where we keep all of our logic regarding creating, updating and comparing achievements.
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
                console.log('TCL: handler:DynamoDBStreamHandler -> valids', valids)
				const artist = artistKeys.find(artist => artist.id.S === artistId)
				const usersWithStats: any = await getStatsForUsers(artist, artistId, valids, tableStat)
          
				let filtered = usersWithStats.filter(
					(listener: any) => listener.ttl !== 0
				)

				console.log('Existing top listeners filtered by non zero scores. There are currently ', filtered)

				if (filtered.length) {
					filtered = filtered.filter(
						listener =>
							filtered.indexOf(listener) ===
							filtered.lastIndexOf(listener)
					)
					if (filtered.length >= 3) {
						let [
							first = false,
							second = false,
							third = false
						] = _.sortBy(
							filtered,
							(listener: any) => listener.ttl
						).reverse()
						console.log('Three Top Listeners')
						
						if (first) {
							// cc:Achievements Lambda#3; Function writeAchievement; This is responsible for creating achievement records in sync with the user's streaming behavior - as this function (and file at large) only fires when the Stats Table has been updated
							await tableAchievement.writeAchievement({
								artistId,
								achievementType: 'topListener',
								achievementValue: 'first',
								periodType: 'life',
								periodValue: 'life',
								currentTime: first.currentTime,
								uid: first.user.uid,
								total: first.ttl,
								user: first.user
							})
						}
						if (second) {
							console.log('second place user returned from get user Stats: ', second)
							await tableAchievement.writeAchievement({
								artistId,
								achievementType: 'topListener',
								achievementValue: 'second',
								periodType: 'life',
								periodValue: 'life',
								currentTime: second.currentTime,
								uid: second.user.uid,
								total: second.ttl,
								user: second.user
							})
						}
						if (third) {
							await tableAchievement.writeAchievement({
								artistId,
								achievementType: 'topListener',
								achievementValue: 'third',
								periodType: 'life',
								periodValue: 'life',
								currentTime: third.currentTime,
								uid: third.user.uid,
								total: third.ttl,
								user: third.user
							})
						}
					}
                    

					// @ts-ignore
					if (filtered.length === 2) {
						let [first = false, second = false] = _.sortBy(
							filtered,
							(listener: any) => listener.ttl
						).reverse()
						console.log('TCL: Two Top Listeners')
						
						if (first) {
							await tableAchievement.writeAchievement({
								artistId,
								achievementType: 'topListener',
								achievementValue: 'first',
								periodType: 'life',
								periodValue: 'life',
								currentTime: first.currentTime,
								uid: first.user.uid,
								total: first.ttl,
								user: first.user
							})
						}
						if (second) {
							console.log('second place user returned from get user Stats: ', second)
							await tableAchievement.writeAchievement({
								artistId,
								achievementType: 'topListener',
								achievementValue: 'second',
								periodType: 'life',
								periodValue: 'life',
								currentTime: second.currentTime,
								uid: second.user.uid,
								total: second.ttl
							})
						}
					}

					// @ts-ignore
					if (filtered.length === 1) {
						let [first] = filtered
						console.log('Only One Top Listener')
						if (first) {
							await tableAchievement.writeAchievement({
								artistId,
								achievementType: 'topListener',
								achievementValue: 'first',
								periodType: 'life',
								periodValue: 'life',
								currentTime: first.currentTime,
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
		console.log(
			'These are the listeners we have created new achievements for',
			topListenersByArtist
		)
	}
        

	log.close()
}
