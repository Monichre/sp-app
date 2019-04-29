import { ApolloServer } from 'apollo-server-lambda'
import { schema } from './schema'
import { verifyEnv } from '../../shared/env';
import * as winston from 'winston'
import { slog } from '../logger';

export type Context = {
  DYNAMO_ENDPOINT: string
  TABLE_PLAY: string
  TABLE_USER: string
  TABLE_STAT: string
  QUEUE_START_HARVEST_USER: string
  log: winston.Logger
}

// const log = slog.child({handler: 'graphql', awsEvent: 'http'})

const server = new ApolloServer({
  schema,
  context: ({event}) => {
    const { query, ...body} = JSON.parse(event.body)
    // const prettyQuery = (query as string).replace(RegExp('\n', 'g'), "\n")
    // log.info(query + JSON.stringify({ ...body }, null, 2))
    const log = slog.child({handler: `graphql/${body && body.operationName}`, awsEvent: 'http'})
    log.info('request', body)
    return {
      log,
      ...verifyEnv({
        DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
        TABLE_PLAY: process.env.TABLE_PLAY,
        TABLE_USER: process.env.TABLE_USER,
        TABLE_STAT: process.env.TABLE_STAT,
        QUEUE_START_HARVEST_USER: process.env.QUEUE_START_HARVEST_USER,
      })
    }
  },
  formatError: error => {
    const log = slog.child({handler: 'graphql', awsEvent: 'http'})
    log.error(error)
    return error
  }
});

export const handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  }
})

