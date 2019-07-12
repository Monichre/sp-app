import { ApolloServer } from 'apollo-server-lambda'
import { schema } from './schema'
import { verifyEnv } from '../../shared/env';
import * as winston from 'winston'
import { makeLogger, TLogger } from '../logger';

export type Context = {
	DYNAMO_ENDPOINT: string
	TABLE_PLAY: string
	TABLE_USER: string
	TABLE_STAT: string
	TABLE_ACHIEVEMENT: string
	QUEUE_START_HARVEST_USER: string
	log: TLogger
}

// const log = slog.child({handler: 'graphql', awsEvent: 'http'})

const server = new ApolloServer({
  schema,
  context: ({event}) => {
    const { query, ...body} = JSON.parse(event.body)
    // const prettyQuery = (query as string).replace(RegExp('\n', 'g'), "\n")
    // log.info(query + JSON.stringify({ ...body }, null, 2))
    const log = makeLogger({handler: `graphql/${body && body.operationName}`, awsEvent: 'http'})
    log.info('request', body)
    return {
      log,
      ...verifyEnv({
        DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
        TABLE_PLAY: process.env.TABLE_PLAY,
        TABLE_USER: process.env.TABLE_USER,
        TABLE_STAT: process.env.TABLE_STAT,
        TABLE_ACHIEVEMENT: process.env.TABLE_ACHIEVEMENT,
        QUEUE_START_HARVEST_USER: process.env.QUEUE_START_HARVEST_USER,
      })
    }
  },
  formatError: error => {
    const log = makeLogger({handler: 'graphql', awsEvent: 'http'})
    log.error(error)
    log.close()
    return error
  }
});

export const handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  }
})

