import { SQSHandler } from "aws-lambda";
import { verifyEnv } from "../../shared/env";
import { TableUser } from "../../shared/tables/TableUser";
import { QueueStartHarvestUser, QueueFetchSpotifyPlays } from "../../shared/queues";
import { handleInvalid } from "../../shared/validation";

import { slog } from "../logger";
const log = slog.child({handler: 'startHarvestUser', awsEvent: 'sqs'})

export const handler: SQSHandler = async (event, context) => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    TABLE_USER: process.env.TABLE_USER,
    QUEUE_FETCH_SPOTIFY_PLAYS: process.env.QUEUE_FETCH_SPOTIFY_PLAYS,
    QUEUE_VALIDATION_ERRORS: process.env.QUEUE_VALIDATION_ERRORS,
  }, log)
  const { valids, invalids } = QueueStartHarvestUser.extract(event)
  if (invalids.length > 0) {
    await Promise.all(invalids.map(i => handleInvalid(log, env.QUEUE_VALIDATION_ERRORS, i.errors, { handler: 'startHarvestAllUsers', input: i.item })))
    return
  }
  const { uid }  = valids[0]

  const table = TableUser(env.DYNAMO_ENDPOINT, env.TABLE_USER)
  const { valid, invalid } = await table.getUser(uid)
  if (invalid) {
    handleInvalid(log, env.QUEUE_VALIDATION_ERRORS, invalid.errors, { handler: 'startHarvestAllUsers', input: invalid.item} )
    return
  }
  log.info(`start harvest user publishing to fetch ${valid.uid}`)

  await QueueFetchSpotifyPlays.publish(env.QUEUE_FETCH_SPOTIFY_PLAYS, valid)
}
