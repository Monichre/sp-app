import * as R from 'ramda'
import { SQSHandler, SQSEvent } from "aws-lambda";
import { SpotifyApi, TSpotifyTrack, TSpotifyPlay, TSpotifyArtistTerse, TSpotifyArtistVerbose } from "../../shared/SpotifyApi";
import { QueueEnrichPlayArtists, TMessageEnrichPlayArtists } from "../../shared/queues";
import { TableUser } from '../../shared/tables/TableUser';
import * as t from 'io-ts';

import { slog } from "../logger";
import moment = require('moment');
import { TablePlay } from '../../shared/tables/TablePlay';
import { handleInvalid, decodeAll } from '../../shared/validation';
const log = slog.child({handler: 'enrichPlayArtists', awsEvent: 'sqs'})

// trimming off ms greatly reduces spurious repeat results from spotify api
const restringDate = (p: string) => new Date(p).toISOString()
const resetMs = (p: string) => `${p.split('.')[0]}.000Z`
const sanitizeSpotifyPlayedAt = R.compose(resetMs, restringDate)

const HandlerEnv = t.type({
  DYNAMO_ENDPOINT: t.string,
  TABLE_PLAY: t.string,
  TABLE_USER: t.string,
  QUEUE_VALIDATION_ERRORS: t.string,
  SPOTIFY_CLIENT_ID: t.string,
  SPOTIFY_CLIENT_SECRET: t.string,
  SPOTIFY_REDIRECT_URI: t.string,
})
type THandlerEnv = t.TypeOf<typeof HandlerEnv>

const decodeEnv = <T>(decoder: t.Decoder<any, T>, env: any): { valid: T | null, invalid: t.Errors | null} => {
  const decoded = decoder.decode(env)
  const valid = decoded.isRight() && decoded.value
  const invalid = decoded.isLeft() && decoded.value
  return { valid, invalid }
}

// WIP
// const extractRecords = (event: SQSEvent) => event.Records

// const makeHandler = (envDecoder: t.Decoder<any, any>, msgDecoder: t.Decoder<any, any>) =>
//   async (event) => {
//     const { valid: env, invalid } = decodeEnv(envDecoder, process.env)
//     if (invalid) { throw new Error(`handler env missing vars ${JSON.stringify(invalid)}`)}
//     const { valids, invalids } = decodeAll(msgDecoder, extractRecords(event))
//     await Promise.all(invalids.map(i => handleInvalid(log, env.QUEUE_VALIDATION_ERRORS, i.errors, { handler: 'fetchSpotifyPlays', input: i.item })))
//     await Promise.all(valids.map(handleMessage(env)))
//   }

export const handler: SQSHandler = async (event) => {
  // ALWAYS DO THIS FIRST -- with sls offline, discovered some cases where process.env vars clobber each other
  // which is a particularly savory flavor of hell let me tell you
  const { valid: env, invalid } = decodeEnv(HandlerEnv, process.env)
  if (invalid) { throw new Error(`handler env missing vars ${JSON.stringify(invalid)}`)}

  // the queue message tells us about the user we're fetching for
  const { valids, invalids } = QueueEnrichPlayArtists.extract(event)
  await Promise.all(invalids.map(i => handleInvalid(log, env.QUEUE_VALIDATION_ERRORS, i.errors, { handler: 'fetchSpotifyPlays', input: i.item })))
  await Promise.all(valids.map(handleMessage(env)))
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

export const localizeDatestring = (utcOffset: number) => (dts: string) => {
  const utcf = moment.utc(dts).utcOffset(utcOffset, false).toISOString(true)
  // none of the other ones do what we want -- leaving here for reference
  // const localt = moment(dts).utcOffset(utcOffset, true).toISOString(true)
  // const localf = moment(dts).utcOffset(utcOffset, false).toISOString(true)
  // const utct = moment.utc(dts).utcOffset(utcOffset, true).toISOString(true)
  // const pzt = moment.parseZone(dts).utcOffset(utcOffset, true).toISOString(true)
  // const pzf = moment.parseZone(dts).utcOffset(utcOffset, false).toISOString(true)
  return utcf
}

const handleMessage = (env: THandlerEnv) => async ({
  user: { uid, accessToken, refreshToken, utcOffset },
  plays,
}: TMessageEnrichPlayArtists) => {
  const api = SpotifyApi(env, accessToken, refreshToken)
  log.info('plays to enrich', { count: plays.length})
  const artistIds = pluckArtistIdsFromPlays(plays)
  /// this should probably just not enrich and still write.  can you have tracks with no artists?
  log.info('uniques to retreive', {artistIds})
  if (artistIds.length === 0) { return }

  let enrichedArtists: TSpotifyArtistVerbose[] = []

  for (let i = 0; i < artistIds.length; i+=50) {
    const batchArtists = artistIds.slice(i, i+49)
    const batchResult = await api.getArtists(batchArtists)
    if (batchResult.isLeft()) {
      // dead letter the message!
      log.error('getArtists failed', {error: batchResult.value})
      return
    }
    enrichedArtists = [...enrichedArtists, ...batchResult.value]
  }

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
      available_markets: null,
      album: {
        ...track.album,
        available_markets: null
      },
      artists: trackArtists.map(ta => enrichedArtists.find(ea => ea.id === ta.id))
    }
  }))

  const localizeToMe = localizeDatestring(utcOffset)

  // write all the results to the table
  log.info('writing enrichedPlays to table', { count: enrichedPlays.length })
  const tablePlay = TablePlay(env.DYNAMO_ENDPOINT, env.TABLE_PLAY)
  for (const play of enrichedPlays) {
    try {
      const playedAt =  localizeToMe(sanitizeSpotifyPlayedAt(play.played_at))

      await tablePlay.putPlay({
        playedAt,
        uid,
        track: play.track,
      })
    } catch (error) {
      log.error('failed to write play', { error, play })
    }
  }

  const table = TableUser(env.DYNAMO_ENDPOINT, env.TABLE_USER)
  await table.updateSpotifyLastUpdate(uid, new Date().toISOString())
}
