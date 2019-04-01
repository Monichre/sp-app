import { ApolloServer } from 'apollo-server-lambda'
import { schema } from './schema'
import { verifyEnv } from '../../shared/env';

export type Context = {
  DYNAMO_ENDPOINT: string
  TABLE_PLAY: string
  TABLE_USER: string
  QUEUE_START_HARVEST_USER: string
}

const server = new ApolloServer({
  schema,
  context: () => verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    TABLE_PLAY: process.env.TABLE_PLAY,
    TABLE_USER: process.env.TABLE_USER,
    QUEUE_START_HARVEST_USER: process.env.QUEUE_START_HARVEST_USER,
  })
});

export const handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  }
})

