import * as AWS from 'aws-sdk';
import * as R from 'ramda'
import { SQSHandler } from "aws-lambda";
import { SpotifyApi } from "../../shared/SpotifyApi";
import { verifyEnv } from "../../shared/env";
import { QueueFetchSpotifyPlays, QueueEnrichPlayArtists } from "../../shared/queues";
import { TableUser } from '../../shared/tables/TableUser';

import { slog } from "../logger";
import { handleInvalid } from '../../shared/validation';
const log = slog.child({handler: 'fetchSpotifyPlays', awsEvent: 'sqs'})

const wait = async (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

// const errorPath = (e: Errors) => e.map(ee => ee.context.map(({key}) => key).join('.'))

export const handler: SQSHandler = async (event) => {
  // ALWAYS DO THIS FIRST -- with sls offline, discovered some cases where process.env vars clobber each other
  // which is a particularly savory flavor of hell let me tell you
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    QUEUE_ENRICH: process.env.QUEUE_ENRICH,
    TABLE_USER: process.env.TABLE_USER,
    QUEUE_VALIDATION_ERRORS: process.env.QUEUE_VALIDATION_ERRORS,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
  }, log)

  // the queue message tells us about the user we're fetching for
  const { valids, invalids } = QueueFetchSpotifyPlays.extract(event)
  if (invalids.length > 0) {
    await Promise.all(invalids.map(i => handleInvalid(log, env.QUEUE_VALIDATION_ERRORS, i.errors, { handler: 'fetchSpotifyPlays', input: i.item })))
    return
  }

  // we should only get one record per message, nu?
  // dont be a jackass, split this out into handleEvent for individual valids
  const { uid , accessToken, refreshToken, utcOffset } = valids[0]
  // const { uid , accessToken, refreshToken, utcOffset } = 

  // use the spotify api to get recent plays
  const api = SpotifyApi(env, accessToken, refreshToken)

  // for primate-testing onboarding workflow, put a 3-second delay in front of this
  // await wait(3000)
  
  const result = await api.getMyRecentlyPlayedTracks({ limit: 50 })
  if (result.isLeft()) {
    // dead letter the message!
    log.error(`Error fetching recently played tracks`, { uid, error: result.value })
    return
  }

  const items = result.value
  log.info(`api returned ${items.length} items`)

  if (items.length > 0) {
    QueueEnrichPlayArtists.publish(env.QUEUE_ENRICH, {
      user: { uid, accessToken, refreshToken, utcOffset },
      plays: items,
    })
  }

  // update the user's credentials record with a lastUpdate
  // THIS SHOULD BE THE LAST PLAYEDAT FROM THE NEWEST PLAY WE JUST WROTE
  const table = TableUser(env.DYNAMO_ENDPOINT, env.TABLE_USER)
  await table.setSpotifyLastUpdate(uid, new Date().toISOString())


  // YAGNI
  // const kin = process.env.STAGE==='local' ?
  //   new AWS.Kinesis({endpoint:'http://localhost:4567'}) :
  //   new AWS.Kinesis()
  
  // await kin.putRecords({
  //   Records: fakeResponse.map(r => ({ Data: JSON.stringify(r), PartitionKey: r.track.trackid.toString()})),
  //   StreamName: process.env.STREAM_TARGET,
  // }, () => {}).promise()
}
