import { DynamoDBStreamHandler, DynamoDBRecord } from "aws-lambda";
import { verifyEnv } from "../../shared/env";

import { slog } from "../logger";
import { TableStat } from "../../shared/tables/TableStat";
import { TablePlay } from '../../shared/tables/TablePlay';
import { handleInvalid } from '../../shared/validation';

const log = slog.child({handler: 'onPlayUpdateArtistStats', awsEvent: 'ddbs'})

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
  TABLE_STAT: string,
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
    log.info(`Updating Artist Stats ${track.name}`)

    const artists = track.artists
    // log.info('artists for this track:', {artists: artists.map(({name, genres, images})=>({name, genres, images}))})
    
    const table = TableStat(env.DYNAMO_ENDPOINT, env.TABLE_STAT)
    const { day, week, month } = table.periodsFor(playedAt)

    for (const artist of artists) {
      // log.info('updating user and global stats for', {artist: artist.name})
      await table.writeArtistStat({uid, relationType: 'artist', relationKey: artist.id, periodType: 'day', periodValue: day, playDurationMs, artist})
      await table.writeArtistStat({uid, relationType: 'artist', relationKey: artist.id, periodType: 'week', periodValue: week, playDurationMs, artist})
      await table.writeArtistStat({uid, relationType: 'artist', relationKey: artist.id, periodType: 'month', periodValue: month, playDurationMs, artist})
      await table.writeArtistStat({uid, relationType: 'artist', relationKey: artist.id, periodType: 'life', periodValue: 'life', playDurationMs, artist})

      await table.writeArtistStat({uid: 'global', relationType: 'artist', relationKey: artist.id, periodType: 'day', periodValue: day, playDurationMs, artist})
      await table.writeArtistStat({uid: 'global', relationType: 'artist', relationKey: artist.id, periodType: 'week', periodValue: week, playDurationMs, artist})
      await table.writeArtistStat({uid: 'global', relationType: 'artist', relationKey: artist.id, periodType: 'month', periodValue: month, playDurationMs, artist})
      await table.writeArtistStat({uid: 'global', relationType: 'artist', relationKey: artist.id, periodType: 'life', periodValue: 'life', playDurationMs, artist})
    }

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