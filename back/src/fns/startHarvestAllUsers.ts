import { ScheduledHandler, ScheduledEvent, Context, APIGatewayEvent, APIGatewayProxyResult, Handler } from "aws-lambda";
import { verifyEnv } from "../shared/env";
import { TableUser } from "../shared/tables/TableUser";
import { QueueFetchSpotifyPlays } from "../shared/queues";


export const handler: Handler<ScheduledEvent | APIGatewayEvent, void | APIGatewayProxyResult> = async (event, context) => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    TABLE_SOURCE: process.env.TABLE_SOURCE,
    QUEUE_TARGET: process.env.QUEUE_TARGET
  })
  const table = TableUser(env.DYNAMO_ENDPOINT, env.TABLE_SOURCE)
  const creds = await table.getAllSpotifyCreds()

  for (const cred of creds) {
    await QueueFetchSpotifyPlays.publish( env.QUEUE_TARGET, {
      uid: cred.uid,
      accessToken: cred.accessToken,
      refreshToken: cred.refreshToken,
    })
  }
  if (event['httpMethod']) { // hacky test to see if its being called from http
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `${creds.length} users harvesting`,
        uids: creds.map(i => i.uid)
      }, null, 2)
    }  
  }

}
