import { DynamoDBStreamHandler, DynamoDBRecord } from "aws-lambda";
import { verifyEnv } from "../../shared/env";

import { makeLogger, TLogger } from "../logger";
import { TableStat } from "../../shared/tables/TableStat";
import { TablePlay } from '../../shared/tables/TablePlay';
import { TableAchievement } from '../../shared/tables/TableAchievement'
import { handleInvalid } from '../../shared/validation';
import winston = require("winston");

// const log = slog.child({handler: 'onPlayUpdateArtistStats', awsEvent: 'ddbs'})

export const handler: DynamoDBStreamHandler = async (event, context) => {
  const log = makeLogger({handler: 'onPlayUpdateArtistStats', awsEvent: 'ddbs'})
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    TABLE_STAT: process.env.TABLE_STAT,
    QUEUE_VALIDATION_ERRORS: process.env.QUEUE_VALIDATION_ERRORS,
  }, log)
  log.info(`${event.Records.length} records`)
  await Promise.all(event.Records.map(handleRecord(env, log)))
  log.close()
}

type Env = {
  DYNAMO_ENDPOINT: string,
  TABLE_STAT: string,
  TABLE_ACHIEVEMENT: string,
  QUEUE_VALIDATION_ERRORS: string,
}

const handleRecord = (env: Env, log: TLogger) => async (record: DynamoDBRecord) => {
  
  /**
   *
   * I want to see the User info here to post that shit as a key entry in the respective Artist's AchievementType key * ['Top', 'First']
   *
   */
  
  
  console.log('TCL: handleRecord -> record: Id love some user info here: ', record)
  const { eventName, dynamodb: { Keys } } = record
  log.info(eventName, Keys)
  if (eventName === 'INSERT') {

    const tableStat = TableStat(env.DYNAMO_ENDPOINT, env.TABLE_STAT)
    const tableAchievement = TableStat(env.DYNAMO_ENDPOINT, env.TABLE_ACHIEVEMENT)
    const tablePlay = TablePlay(env.DYNAMO_ENDPOINT, "") // not actually writing anything, this is hacky af [Why??]
    const { valid, invalid } = tablePlay.decode(record.dynamodb.NewImage)

    if (invalid) {
      handleInvalid(log, env.QUEUE_VALIDATION_ERRORS, invalid.errors, {handler: 'onPlayUpdateArtistStats', input: invalid.item })
      return
    }
    const { playedAt, track, uid } = valid
    const { duration_ms: playDurationMs } = track
    log.info(`Updating Artist Stats ${track.name}`)

    const artists = track.artists
    const { day, week, month } = tableStat.periodsFor(playedAt)

    for (const artist of artists) {
      // log.info('updating user and global stats for', {artist: artist.name})
      await tableStat.writeArtistStat({uid, relationType: 'artist', relationKey: artist.id, periodType: 'day', periodValue: day, playDurationMs, artist})
      await tableStat.writeArtistStat({uid, relationType: 'artist', relationKey: artist.id, periodType: 'week', periodValue: week, playDurationMs, artist})
      await tableStat.writeArtistStat({uid, relationType: 'artist', relationKey: artist.id, periodType: 'month', periodValue: month, playDurationMs, artist})
      await tableStat.writeArtistStat({uid, relationType: 'artist', relationKey: artist.id, periodType: 'life', periodValue: 'life', playDurationMs, artist})

      await tableStat.writeArtistStat({uid: 'global', relationType: 'artist', relationKey: artist.id, periodType: 'day', periodValue: day, playDurationMs, artist})
      await tableStat.writeArtistStat({uid: 'global', relationType: 'artist', relationKey: artist.id, periodType: 'week', periodValue: week, playDurationMs, artist})
      await tableStat.writeArtistStat({uid: 'global', relationType: 'artist', relationKey: artist.id, periodType: 'month', periodValue: month, playDurationMs, artist})
      await tableStat.writeArtistStat({uid: 'global', relationType: 'artist', relationKey: artist.id, periodType: 'life', periodValue: 'life', playDurationMs, artist})
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