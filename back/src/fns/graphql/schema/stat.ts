import * as AWS from 'aws-sdk';
import { makeExecutableSchema } from "graphql-tools";
import { QueryResolvers } from "../types";
import { verifyEnv } from '../../../shared/env';
import moment = require('moment');

const typeDefs = `
type Query {
  playtimeSummary(uid: String!): PlaytimeSummaryResponse!
}
type Mutation {
  _: String
}

type PlaytimeSummaryResponse {
  today: Int!
  thisMonth: Int!
}
`

const playtimeSummary: QueryResolvers.PlaytimeSummaryResolver = async (_, {uid}, context) => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    TABLE_STAT: process.env.TABLE_STAT,
  })

  // this should all be:
  // const { day, month } = table.periodsFor((new Date()).toISOString())
  // const today = await table.getUserStat(uid, 'total', 'day', day)
  // const thisMonth = await table.getUserStat(uid, 'total', 'month', month)
  const doc = new AWS.DynamoDB.DocumentClient({endpoint: env.DYNAMO_ENDPOINT})
  const TableName = env.TABLE_STAT

  const m = moment()
  const day = m.format('YYYY-MM-DD')
  const month = m.format('YYYY-MM')

  const today = await doc.get({
    TableName,
    Key: {
      pk: [uid, 'total', 'day', day].join('#'),
      sk: [uid, 'day', 'total'].join('#'),
    }
  }).promise()
  const thisMonth = await doc.get({
    TableName,
    Key: {
      pk: [uid, 'total', 'month', month].join('#'),
      sk: [uid, 'month', 'total'].join('#'),
    }
  }).promise()
  return {
    today: today.Item.playDurationMs,
    thisMonth: thisMonth.Item.playDurationMs,
  }
}

const resolvers = {
  Query: {
    playtimeSummary,
  }
}

export const schema = makeExecutableSchema({typeDefs, resolvers})