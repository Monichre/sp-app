// @ts-nocheck
// @ts-ignore
import { makeExecutableSchema } from 'graphql-tools'
import {
	QueryResolvers,
	UserInfoResponseResolvers,
	UserInfoResponse
} from '../types'
import { TableUser } from '../../../shared/tables/TableUser'
import {
	TableAchievement,
	Achievement
} from '../../../shared/tables/TableAchievement'
import * as moment from 'moment'
import { QueueStartHarvestUser } from '../../../shared/queues'

const typeDefs = `
type Query {
  getUserInfo(uid: String!): UserInfoResponse!
  getUserAchievements(
	uid: String!,
	achievementType: String!,
	achievementValue: String!,
	periodType: String!,
	periodValue: String!,
	date: String!): [UserAchievement]
}


type Image {
  url: String!
}
type SpotifyUrl {
  spotify: String!
}


type User {
  photoURL: String
  uid: String
  email: String
  utcOffset: Int
  displayName: String
  lastUpdate: String
  sk: String
  totalUpdates: Int
  pk: String
  accessToken: String
  refreshToken: String
}


type TopListener {
  sk: String
  pk: String
  total: Float
  user: User
}

type Artist {
  id: String!
  name: String!
  images: [Image!]!
  external_urls: SpotifyUrl!
  genres: [String!]!
  topListeners: [TopListener]
}

type UserAchievement {
	artist: Artist
	achievementType: String
	achievementValue: String
	periodType: String
	periodValue: String
	total: Int
	date: String
	lastUpdated: String
}

type UserInfoResponse {
  uid: String!
  email: String!
  lastUpdate: String
  displayName: String
  photoURL: String
  initialHarvestComplete: Boolean
  
}
`

// how long after fetchSpotifyPlays completes do we think it takes for stats to be crunched
const MAGIC_DELAY = 10
const MAGIC_STALE_THRESHOLD = 30

/*=============================================
=            cc: User Type#1            =
=============================================*/

/* cc: Helper */
const isInitialHarvestComplete = ({
	totalUpdates,
	lastUpdate
}: {
	totalUpdates?: number
	lastUpdate?: string
}) =>
	totalUpdates &&
	(totalUpdates > 1 ||
		(totalUpdates === 1 &&
			// @ts-ignore
			moment()
				.subtract(MAGIC_DELAY, 'seconds')
				.isAfter(lastUpdate)))

/* cc: Helper */
const isOlderThan = (olderSeconds: number, dts: string) =>
	// @ts-ignore
	moment()
		.subtract(olderSeconds, 'seconds')
		.isAfter(dts)

/**
 *
 * cc: User Resolver#1; getUserInfo
 *
 */
// @ts-ignore
const getUserInfo: QueryResolvers.GetUserInfoResolver = async (
	_,
	{ uid },
	{ log, DYNAMO_ENDPOINT, TABLE_USER }
) => {
	log.info(uid)
	const tablePlay = TableUser(DYNAMO_ENDPOINT, TABLE_USER)
	const { valid } = await tablePlay.getUser(uid)

	return valid
}

/**
 *
 * cc: User Resolver#2; isInitialHarvestComplete
 *
 */

const initialHarvestComplete: UserInfoResponseResolvers.InitialHarvestCompleteResolver = async (
	userInfo,
	{},
	context
) => {
	if (
		userInfo.lastUpdate &&
		isOlderThan(MAGIC_STALE_THRESHOLD, userInfo.lastUpdate)
	) {
		context.log.info(`lastUpdate older than ${MAGIC_STALE_THRESHOLD} seconds`, {
			queueName: context.QUEUE_START_HARVEST_USER
		})
		QueueStartHarvestUser.publish(context.QUEUE_START_HARVEST_USER, {
			uid: userInfo.uid
		})
	}
	// @ts-ignore
	return isInitialHarvestComplete(userInfo)
}

const getUserAchievements: any = async (
	_: any,
	{
		uid,
		achievementType,
		achievementValue,
		periodType,
		periodValue,
		date
	}: any,
	{ log, DYNAMO_ENDPOINT, TABLE_ACHIEVEMENT }: any
) => {
	const tableAchievement = TableAchievement(DYNAMO_ENDPOINT, TABLE_ACHIEVEMENT)

	const data = await tableAchievement.getUserAchievements(
		uid,
		achievementType,
		achievementValue,
		periodType,
		periodValue,
		date
	)
	console.log('TCL: data', data)
	return data
}

const UserInfoResponse = {
	initialHarvestComplete
}

const resolvers = {
	Query: {
		getUserInfo,
		getUserAchievements
	},
	UserInfoResponse
}

export const schema = makeExecutableSchema({
	typeDefs,
	resolvers
})
