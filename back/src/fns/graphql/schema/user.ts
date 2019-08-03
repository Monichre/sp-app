import { makeExecutableSchema } from 'graphql-tools'
import {
	QueryResolvers,
	UserInfoResponseResolvers,
	UserInfoResponse
} from '../types'
import { TableUser } from '../../../shared/tables/TableUser'
import moment = require('moment')
import { QueueStartHarvestUser } from '../../../shared/queues'

const typeDefs = `
type Query {
  getUserInfo(uid: String!): UserInfoResponse!
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
			moment()
				.subtract(MAGIC_DELAY, 'seconds')
				.isAfter(lastUpdate)))

/* cc: Helper */
const isOlderThan = (olderSeconds: number, dts: string) =>
	moment()
		.subtract(olderSeconds, 'seconds')
		.isAfter(dts)

/**
 *
 * cc: User Resolver#1; getUserInfo
 *
 */

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
	return isInitialHarvestComplete(userInfo)
}

const UserInfoResponse = {
	initialHarvestComplete
}

const resolvers = {
	Query: {
		getUserInfo
	},
	UserInfoResponse
}

export const schema = makeExecutableSchema({
	typeDefs,
	resolvers
})
