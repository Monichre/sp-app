import * as R from 'ramda'
import { DynamoDBStreamHandler, DynamoDBRecord } from "aws-lambda";
import { verifyEnv } from "../../shared/env";

import { slog } from "../logger";
import { TableStat } from "../../shared/tables/TableStat";
import { TablePlay } from '../../shared/tables/TablePlay';
import { handleInvalid } from '../../shared/validation';

const log = slog.child({handler: 'onPlayUpdateGenreStats', awsEvent: 'ddbs'})

export const handler: DynamoDBStreamHandler = async (event, context) => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    TABLE_STAT: process.env.TABLE_STAT,
    QUEUE_VALIDATION_ERRORS: process.env.QUEUE_VALIDATION_ERRORS,
  }, log)
  log.info(`${event.Records.length} records`)
  await Promise.all(event.Records.map(handleRecord(env)))
}

type Env = {
  DYNAMO_ENDPOINT: string,
  TABLE_STAT: string
  QUEUE_VALIDATION_ERRORS: string,
}

const handleRecord = (env: Env) => async (record: DynamoDBRecord) => {
  const { eventName, dynamodb: { Keys } } = record
  log.info(eventName, Keys)
  if (eventName === 'INSERT') {

    const tablePlay = TablePlay(env.DYNAMO_ENDPOINT, "") // not actually writing anything, this is hacky af
    const { valid, invalid } = tablePlay.decode(record.dynamodb.NewImage)
    if (invalid) {
      handleInvalid(log, env.QUEUE_VALIDATION_ERRORS, invalid.errors, {handler: 'onPlayUpdateArtistStats', input: invalid.item })
      return
    }

    const { playedAt, track, uid } = valid
    const { duration_ms: playDurationMs } = track
    log.info(`Updating Genre Stats ${track.name}`)

    const artists = track.artists
    // log.info('artists for this track:', {artists: artists.map(({name, genres, images})=>({name, genres, images}))})
    
    const g = artists.map(a=> a.genres)
    const genres = R.uniq(R.flatten<string>(g))
    log.info('genres from artists from this track', genres)

    const table = TableStat(env.DYNAMO_ENDPOINT, env.TABLE_STAT)
    const { day, week, month } = table.periodsFor(playedAt)

    const promises = R.flatten(genres.map(genre => ([
      table.writeGenreStat({uid, relationType: 'genre', relationKey: genre, periodType: 'day', periodValue: day, playDurationMs, genre}),
      table.writeGenreStat({uid, relationType: 'genre', relationKey: genre, periodType: 'week', periodValue: week, playDurationMs, genre}),
      table.writeGenreStat({uid, relationType: 'genre', relationKey: genre, periodType: 'month', periodValue: month, playDurationMs, genre}),
      table.writeGenreStat({uid, relationType: 'genre', relationKey: genre, periodType: 'life', periodValue: 'life', playDurationMs, genre}),
      table.writeGenreStat({uid: 'global', relationType: 'genre', relationKey: genre, periodType: 'day', periodValue: day, playDurationMs, genre}),
      table.writeGenreStat({uid: 'global', relationType: 'genre', relationKey: genre, periodType: 'week', periodValue: week, playDurationMs, genre}),
      table.writeGenreStat({uid: 'global', relationType: 'genre', relationKey: genre, periodType: 'month', periodValue: month, playDurationMs, genre}),
      table.writeGenreStat({uid: 'global', relationType: 'genre', relationKey: genre, periodType: 'life', periodValue: 'life', playDurationMs, genre}),
    ])))

    await Promise.all(promises)
    log.info('finished all genre stat updates')
    return
  }
  if (eventName === 'REMOVE') {
    log.info('Removed play')
    return
  }
  if (eventName === 'MODIFY') {
    // log.warn('modified play', { Keys, newImage: record.dynamodb.NewImage, oldImage: record.dynamodb.OldImage})
    log.warn('modified play', { Keys })
    return
  }
  log.warn('unknown event', { eventName, Keys })
}