import * as AWS from 'aws-sdk';
import * as R from 'ramda'
import { SQSHandler } from "aws-lambda";
import { SpotifyApi, TSpotifyTrack, TSpotifyPlay, TSpotifyArtistTerse } from "../../shared/SpotifyApi";
import { verifyEnv } from "../../shared/env";
import { QueueFetchSpotifyPlays, QueueEnrichPlayArtists, TMessageEnrichPlayArtists } from "../../shared/queues";
import { TableUser } from '../../shared/tables/TableUser';

import { slog } from "../logger";
const log = slog.child({handler: 'enrichPlayArtists', awsEvent: 'sqs'})

// trimming off ms greatly reduces spurious repeat results from spotify api
// const sanitizeSpotifyPlayedAt = (p: string) => `${p.split('.')[0]}.000Z`

// const sanitizeSpotifyPlayedAt = (p: string) => `${p.split('.')[0]}.000Z`

const restringDate = (p: string) => new Date(p).toISOString()
const resetMs = (p: string) => `${p.split('.')[0]}.000Z`

const sanitizeSpotifyPlayedAt = R.compose(resetMs, restringDate)

const wait = async (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

type TEnv = {
  DYNAMO_ENDPOINT: string
  TABLE_PLAY: string
  TABLE_USER: string
}

export const handler: SQSHandler = async (event) => {
  // ALWAYS DO THIS FIRST -- with sls offline, discovered some cases where process.env vars clobber each other
  // which is a particularly savory flavor of hell let me tell you
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    TABLE_PLAY: process.env.TABLE_PLAY,
    TABLE_USER: process.env.TABLE_USER,
  }, log)

  // the queue message tells us about the user we're fetching for
  // we should only get one record per message, nu?
  // const { uid , accessToken, refreshToken } = QueueFetchSpotifyPlays.extract(event)[0]
  const { errors, messages } = QueueEnrichPlayArtists.extract(event)
  if (errors.length > 0) {
    log.error(`unable to parse messages in queue`, errors)
  }

  await Promise.all(messages.map(handleMessage(env)))
}

type Flattenable<T> = ReadonlyArray<T> | ReadonlyArray<T[]> | ReadonlyArray<ReadonlyArray<T>>

const pluckArtistIdsFromPlays = R.compose<
  TSpotifyPlay[],
  TSpotifyTrack[],
  Flattenable<TSpotifyArtistTerse>,
  TSpotifyArtistTerse[],
  string[],
  string[]
>(
  R.uniq,
  R.pluck('id'),
  R.flatten,
  R.pluck('artists'),
  R.pluck('track'),
)

const handleMessage = (env: TEnv) => async ({
  user: { uid, accessToken, refreshToken },
  plays,
}: TMessageEnrichPlayArtists) => {
  const api = SpotifyApi(accessToken, refreshToken)

  const artistIds = pluckArtistIdsFromPlays(plays)
  /// this should probably just not enrich and still write.  can you have tracks with no artists?
  if (artistIds.length === 0) { return }
  log.info('retreiving', {artistIds})
  const result = await api.getArtists(artistIds)

  if (result.isLeft()) {
    // dead letter the message!
    log.error('getArtists failed', {error: result.value})
    return
  }
  const enrichedArtists = result.value

  const enrichedPlays = plays.map(({
    played_at,
    track: {
      artists: trackArtists,
      ...track
    }
  }) => ({
    played_at,
    track: {
      ...track,
      artists: trackArtists.map(ta => enrichedArtists.find(ea => ea.id === ta.id))
    }
  }))

  // write all the results to the table
  log.info(`Play table [${env.TABLE_PLAY}] at [${env.DYNAMO_ENDPOINT}]`)
  const doc = new AWS.DynamoDB.DocumentClient({endpoint: env.DYNAMO_ENDPOINT})
  const TableName = env.TABLE_PLAY
  for (const play of enrichedPlays) {
    try {
      const playedAt = sanitizeSpotifyPlayedAt(play.played_at)
      try {
        const result = await doc.put({
          TableName,
          Item: {
            pk: uid,
            sk: `track#${playedAt}`,
            fk: `${play.track.id}#${playedAt}`,
            playedAt,
            track: JSON.stringify(play.track)
          }
        }).promise()
        log.info(`saved enriched`, {name: play.track.name, playedAt: play.played_at})
      } catch (error) {
        log.error('error writing play to table', {error, track: play.track, playedAt, uid})
      }
    } catch (error) {
      log.error('sanitizeSpotifyPlayedAt failed', {error, play})
      break
    }
    // we should only write if the playedAt is more recent than the user's lastPlayedAt
    // and we should collect these and do a batch write
  }
  const table = TableUser(env.DYNAMO_ENDPOINT, env.TABLE_USER)
  await table.setSpotifyLastUpdate(uid, new Date().toISOString())
}
