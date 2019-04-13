import * as AWS from 'aws-sdk';
import * as R from 'ramda'
import { SQSHandler } from "aws-lambda";
import { SpotifyApi, TSpotifyTrack, TSpotifyPlay, TSpotifyArtistTerse, TSpotifyArtistVerbose } from "../../shared/SpotifyApi";
import { verifyEnv } from "../../shared/env";
import { QueueFetchSpotifyPlays, QueueEnrichPlayArtists, TMessageEnrichPlayArtists } from "../../shared/queues";
import { TableUser } from '../../shared/tables/TableUser';

import { slog } from "../logger";
import moment = require('moment');
import { TablePlay } from '../../shared/tables/TablePlay';
import { Errors } from 'io-ts';
import { handleInvalid } from '../../shared/validation';
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
  QUEUE_VALIDATION_ERRORS: string,
  SPOTIFY_CLIENT_ID: string,
  SPOTIFY_CLIENT_SECRET: string,
  SPOTIFY_REDIRECT_URI: string,
}

export const handler: SQSHandler = async (event) => {
  // ALWAYS DO THIS FIRST -- with sls offline, discovered some cases where process.env vars clobber each other
  // which is a particularly savory flavor of hell let me tell you
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    TABLE_PLAY: process.env.TABLE_PLAY,
    TABLE_USER: process.env.TABLE_USER,
    QUEUE_VALIDATION_ERRORS: process.env.QUEUE_VALIDATION_ERRORS,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
  }, log)

  // the queue message tells us about the user we're fetching for
  // we should only get one record per message, nu?
  // const { uid , accessToken, refreshToken } = QueueFetchSpotifyPlays.extract(event)[0]
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

const localizeDatestring = (utcOffset: number) => (dts: string) => {
  // const localt = moment(dts).utcOffset(utcOffset, true).toISOString(true)
  // const localf = moment(dts).utcOffset(utcOffset, false).toISOString(true)
  // const utct = moment.utc(dts).utcOffset(utcOffset, true).toISOString(true)
  const utcf = moment.utc(dts).utcOffset(utcOffset, false).toISOString(true)
  // const pzt = moment.parseZone(dts).utcOffset(utcOffset, true).toISOString(true)
  // const pzf = moment.parseZone(dts).utcOffset(utcOffset, false).toISOString(true)

  // log.info('localized time', {utcOffset, dts, localt, localf, utct, utcf, pzt, pzf})
  return utcf
}

const handleMessage = (env: TEnv) => async ({
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

      await tablePlay.setPlayTrack({
        playedAt,
        uid,
        track: play.track,
      })
    } catch (error) {
      log.error('failed to write play', { error, play })
    }
  }

  const table = TableUser(env.DYNAMO_ENDPOINT, env.TABLE_USER)
  await table.setSpotifyLastUpdate(uid, new Date().toISOString())
}
