// @ts-nocheck
// @ts-ignore
import { makeExecutableSchema } from 'graphql-tools'
import {
  QueryResolvers,
  UserInfoResponseResolvers,
  UserInfoResponse
} from '../types'
import { TableUser } from '../../../shared/tables/TableUser'
import * as moment from 'moment'
import { QueueStartHarvestUser } from '../../../shared/queues'
import { AchievementEnrichment, StatEnrichment } from '../../agl/functions'
// updateUserGeoLocation(uid: String!, location: String): User
const typeDefs = `
type Query {
  getUserInfo(uid: String!): UserInfoResponse!
	getUserAchievements(pk: String!, uk: String!): [UserAchievement]
	getAllUsers: [User]
}
type Image {
  url: String!
}
type SpotifyUrl {
  spotify: String!
}
type User {
  photoURL: String
	achievements: [String]
	location: String
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
  fk: String
  lastUpdated: String
  total: Float
  user: User
}
type TopListenerDataPeriod {
  first: TopListener
  second: TopListener
  third: TopListener
}
type TopListenerData {
  day: TopListenerDataPeriod
  week: TopListenerDataPeriod
  month: TopListenerDataPeriod
  life: TopListenerDataPeriod
}
type Artist {
  id: String!
  name: String!
  images: [Image!]!
  external_urls: SpotifyUrl!
  genres: [String!]!
  topListeners: TopListenerData
}
type UserAchievement {
	artist: Artist
	total: Int
	lastUpdated: String
	pk: String
	uk: String
	auk: String
	ak: String
	user: User
}
type UserInfoResponse {
  uid: String!
  email: String!
  lastUpdate: String
  displayName: String
  photoURL: String
  initialHarvestComplete: Boolean
  statRecordsEnriched: Boolean
}
`
// how long after fetchSpotifyPlays completes do we think it takes for stats to be crunched
const MAGIC_DELAY = 10
const MAGIC_STALE_THRESHOLD = 30
/*=============================================
=            // cc: User Type#1            =
=============================================*/
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
  const tableUser = TableUser(DYNAMO_ENDPOINT, TABLE_USER)
  const { valid } = await tableUser.getUser(uid)
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
    // const hasEnrichmentAttr = Object.keys(userInfo).includes('statRecordsEnriched')
    // // @ts-ignore
    // if (!hasEnrichmentAttr || hasEnrichmentAttr && !userInfo.statRecordsEnriched) {
    // 	console.log('USER HAS NOT HAD STAT RECORDS ENRICHED')
    // 	await StatEnrichment(userInfo)
    // }
    const { initialize } = AchievementEnrichment(userInfo)
    await initialize()
  }
  // @ts-ignore
  return isInitialHarvestComplete(userInfo)
}
const getAllUsers: any = async (
  _,
  args,
  { log, DYNAMO_ENDPOINT, TABLE_USER }
) => {
  const tableUser = TableUser(DYNAMO_ENDPOINT, TABLE_USER)
  const users = await tableUser.getAllUsers()
  console.log(`TCL: users`, users)
  return users
}
const UserInfoResponse = {
  initialHarvestComplete
}
const resolvers = {
  Query: {
    getUserInfo,
    getAllUsers
  },
  UserInfoResponse
}
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})