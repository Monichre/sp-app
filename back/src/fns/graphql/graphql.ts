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

const server = new ApolloServer({
  schema,
  context: () => ({
    log: slog.child({handler: 'graphql', awsEvent: 'http'}),
    ...verifyEnv({
      DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
      TABLE_PLAY: process.env.TABLE_PLAY,
      TABLE_USER: process.env.TABLE_USER,
      TABLE_STAT: process.env.TABLE_STAT,
      QUEUE_START_HARVEST_USER: process.env.QUEUE_START_HARVEST_USER,
    })
  })
});

export const handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  }
})

