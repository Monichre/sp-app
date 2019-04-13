import { ScheduledEvent, APIGatewayEvent, APIGatewayProxyResult, Handler } from "aws-lambda";
import { verifyEnv } from "../../shared/env";
import { TableUser } from "../../shared/tables/TableUser";
import { QueueFetchSpotifyPlays } from "../../shared/queues";
import { slog } from "../logger";
import { handleInvalid } from "../../shared/validation";

const log = slog.child({awsEvent: 'sqs|http', handler: 'startHarvestAllUsers'})

export const handler: Handler<ScheduledEvent | APIGatewayEvent, void | APIGatewayProxyResult> = async (event, context) => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    TABLE_SOURCE: process.env.TABLE_SOURCE,
    QUEUE_TARGET: process.env.QUEUE_TARGET,
    QUEUE_VALIDATION_ERRORS: process.env.QUEUE_VALIDATION_ERRORS,
  })
  const table = TableUser(env.DYNAMO_ENDPOINT, env.TABLE_SOURCE)
  const { invalids, valids } = await table.getAllSpotifyCreds()
  await Promise.all(invalids.map(i => handleInvalid(log, env.QUEUE_VALIDATION_ERRORS, i.errors, { handler: 'startHarvestAllUsers', input: i.item })))
  log.info('valid users to start harvest on', { count: valids.length })

  for (const cred of valids) {
    await QueueFetchSpotifyPlays.publish( env.QUEUE_TARGET, {
      uid: cred.uid,
      accessToken: cred.accessToken,
      refreshToken: cred.refreshToken,
      utcOffset: cred.utcOffset,
    })
  }
  if (event['httpMethod']) { // hacky test to see if its being called from http
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `${valids.length} users harvesting`,
        uids: valids.map(i => i.uid)
      }, null, 2)
    }  
  }

}

