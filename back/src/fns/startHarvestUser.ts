import { Handler, APIGatewayEvent, SQSHandler } from "aws-lambda";
import * as AWS from 'aws-sdk';
import { verifyEnv } from "../shared/env";
import { TableUser } from "../shared/tables/TableUser";
import { QueueStartHarvestUser, QueueFetchSpotifyPlays } from "../shared/queues";

export const handler: SQSHandler = async (event, context) => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    TABLE_USER: process.env.TABLE_USER,
    QUEUE_FETCH_SPOTIFY_PLAYS: process.env.QUEUE_FETCH_SPOTIFY_PLAYS,
  })
  const { uid } = QueueStartHarvestUser.extract(event)[0]

  const table = TableUser(env.DYNAMO_ENDPOINT, env.TABLE_USER)
  const creds = await table.getSpotifyCreds(uid)
  console.log('start harvest user publishing to fetch:', creds)

  await QueueFetchSpotifyPlays.publish(env.QUEUE_FETCH_SPOTIFY_PLAYS, creds)
}
