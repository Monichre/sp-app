import { DynamoDBStreamHandler, DynamoDBRecord } from "aws-lambda";
import { verifyEnv } from "../../shared/env";

import { slog } from "../logger";
import { TableStat } from "../../shared/tables/TableStat";
import { TablePlay } from '../../shared/tables/TablePlay';
import { handleInvalid } from '../../shared/validation';


const log = slog.child({handler: 'onPlayUpdateTotalStats', awsEvent: 'ddbs'})

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
    log.info('Updating Total Stats')

    const tablePlay = TablePlay(env.DYNAMO_ENDPOINT, "") // not actually writing anything, this is hacky af
    const { valid, invalid } = tablePlay.decode(record.dynamodb.NewImage)
    if (invalid) {
      handleInvalid(log, env.QUEUE_VALIDATION_ERRORS, invalid.errors, {handler: 'onPlayUpdateArtistStats', input: invalid.item })
      return
    }
    const { playedAt, track, uid } = valid
    const { duration_ms: playDurationMs } = track

    log.info(`track from play record`, { uid, name: track.name, playedAt})

    const table = TableStat(env.DYNAMO_ENDPOINT, env.TABLE_STAT)
    const { day, week, month } = table.periodsFor(playedAt)

    await table.writeTotalStat({uid, relationType: 'total', relationKey: 'total', periodType: 'day', periodValue: day, playDurationMs})
    // table.writeStat({uid, relationType: 'total', relationKey: 'total', periodType: 'dow', periodValue: dow, statValue: duration_ms})
    await table.writeTotalStat({uid, relationType: 'total', relationKey: 'total', periodType: 'week', periodValue: week, playDurationMs})
    await table.writeTotalStat({uid, relationType: 'total', relationKey: 'total', periodType: 'month', periodValue: month, playDurationMs})
    // table.writeStat({uid, relationType: 'total', relationKey: 'total', periodType: 'moy', periodValue: moy, statValue: duration_ms})
    // table.writeStat({uid, relationType: 'total', relationKey: 'total', periodType: 'year', periodValue: year, statValue: duration_ms})
    await table.writeTotalStat({uid, relationType: 'total', relationKey: 'total', periodType: 'life', periodValue: 'life', playDurationMs})

    await table.writeTotalStat({uid: 'global', relationType: 'total', relationKey: 'total', periodType: 'day', periodValue: day, playDurationMs})
    await table.writeTotalStat({uid: 'global', relationType: 'total', relationKey: 'total', periodType: 'week', periodValue: week, playDurationMs})
    await table.writeTotalStat({uid: 'global', relationType: 'total', relationKey: 'total', periodType: 'month', periodValue: month, playDurationMs})
    await table.writeTotalStat({uid: 'global', relationType: 'total', relationKey: 'total', periodType: 'life', periodValue: 'life', playDurationMs})

    return
  }
  if (eventName === 'REMOVE') {
    log.info('Removed play')
    return
  }
  if (eventName === 'MODIFY') {
    // log.warn('modified play', { Keys, newImage: record.dynamodb.NewImage, oldImage: record.dynamodb.OldImage})
    log.warn('modified play', { Keys })
  }
  log.warn('unknown event', { eventName, Keys })
}