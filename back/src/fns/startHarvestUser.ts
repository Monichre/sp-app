import { SQSHandler } from "aws-lambda";
import { verifyEnv } from "../shared/env";
import { TableUser } from "../shared/tables/TableUser";
import { QueueStartHarvestUser, QueueFetchSpotifyPlays } from "../shared/queues";

import { slog } from "./logger";
const log = slog.child({handler: 'startHarvestUser', awsEvent: 'sqs'})

export const handler: SQSHandler = async (event, context) => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    TABLE_USER: process.env.TABLE_USER,
    QUEUE_FETCH_SPOTIFY_PLAYS: process.env.QUEUE_FETCH_SPOTIFY_PLAYS,
  }, log)
  const { uid } = QueueStartHarvestUser.extract(event)[0]

  const table = TableUser(env.DYNAMO_ENDPOINT, env.TABLE_USER)
  const creds = await table.getSpotifyCreds(uid)
  log.info(`start harvest user publishing to fetch ${creds.uid}`)

  await QueueFetchSpotifyPlays.publish(env.QUEUE_FETCH_SPOTIFY_PLAYS, creds)
}
