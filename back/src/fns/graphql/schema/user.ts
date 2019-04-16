import { makeExecutableSchema } from "graphql-tools";
import { MutationResolvers, QueryResolvers } from "../types";
import { TableUser, TDocUser } from "../../../shared/tables/TableUser";
import moment = require("moment");
import { QueueStartHarvestUser } from "../../../shared/queues";

const typeDefs = `
type Query {
  getUserInfo(uid: String!): UserInfoResponse!
}

type Mutation {
  _: String
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

const isInitialHarvestComplete = (user: TDocUser) =>
  user.totalUpdates && (
    (user.totalUpdates > 1) ||
    (user.totalUpdates === 1 && moment().subtract(MAGIC_DELAY, 'seconds').isAfter(user.lastUpdate))
  )

const isOlderThan = (olderSeconds: number, dts: string) =>
    moment().subtract(olderSeconds, 'seconds').isAfter(dts)

const getUserInfo: QueryResolvers.GetUserInfoResolver = async (_, {uid}, context) => {
  const log = context.log.child({handler: `graphql/getUserInfo/${uid}`})
  const tablePlay = TableUser(context.DYNAMO_ENDPOINT, context.TABLE_USER)
  const { valid, invalid } = await tablePlay.getUser(uid)

  if (valid.lastUpdate && isOlderThan(MAGIC_STALE_THRESHOLD, valid.lastUpdate)) {
    log.info(`lastUpdate older than ${MAGIC_STALE_THRESHOLD} seconds`, {queueName: context.QUEUE_START_HARVEST_USER})
    QueueStartHarvestUser.publish(context.QUEUE_START_HARVEST_USER, {
      uid,
    })
  }

  return {
    ...valid,
    initialHarvestComplete: isInitialHarvestComplete(valid)
  }
}

const resolvers = {
  Query: {
    getUserInfo
  }
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})