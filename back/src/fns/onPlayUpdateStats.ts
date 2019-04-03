import { DynamoDBStreamHandler, DynamoDBRecord } from "aws-lambda";
import { verifyEnv } from "../shared/env";

import { slog } from "./logger";
import { TableStat } from "../shared/tables/TableStat";

const log = slog.child({handler: 'onPlayUpdateStats', awsEvent: 'ddbs'})

export const handler: DynamoDBStreamHandler = async (event, context) => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    TABLE_STAT: process.env.TABLE_STAT,
  }, log)
  log.info(`${event.Records.length} records`)
  await Promise.all(event.Records.map(handleRecord(env)))
}

type Env = {
  DYNAMO_ENDPOINT: string,
  TABLE_STAT: string
}

const handleRecord = (env: Env) => async (record: DynamoDBRecord) => {
  const { eventName, dynamodb: { Keys } } = record
  log.info(eventName, Keys)
  if (eventName === 'INSERT') {
    log.info('Add stat')
    // should really get a typed version of the record from a TablePlay method
    const {
      pk: { S: uid },
      sk: { S: trackPlayedAt }
    } = Keys
    const playedAt = record.dynamodb.NewImage.playedAt.S
    const track = JSON.parse(record.dynamodb.NewImage.track.S)
    const {
      name,
      duration_ms
    } = track
    log.info(`track from play record ${name} ${playedAt}`, { uid, trackPlayedAt})

    const artists = track.artists.map(a => ({name: a.name, id: a.id}))
    log.info('artists for this track:', {artists})
    // WHEN WE IMPLEMENT ARTIST & GENRE STATS...
    // i think the handler prolly shouldnt have to know this much about how stats work
    // at the same time the stats engine shouldnt have to know that much about the plays?
    // howabout:
    // const track = { name, id }
    // const artists = [{id, ...artistInfo}]
    // const genres = [gtag]

    // await table.updateUserStat(uid, artists, genres, duration_ms)
    // await table.updateArtistStat(aid, track, duration_ms)
    // await table.updateGenreStat(gtag, artists, duration_ms)

    // or

    // await table.updateUserAllStats(uid, artist, genre, duration_ms)
    // =>
    // await table.updateUserTotalDuration(uid, duration_ms)
    // await table.updateUserArtistDuration(uid, artist, duration_ms)
    
    const table = TableStat(env.DYNAMO_ENDPOINT, env.TABLE_STAT)
    const { day, week, month } = table.periodsFor(playedAt)
    await table.writeStat({uid, relationType: 'total', relationKey: 'total', periodType: 'day', periodValue: day, statValue: duration_ms})
    // table.writeStat({uid, relationType: 'total', relationKey: 'total', periodType: 'dow', periodValue: dow, statValue: duration_ms})
    await table.writeStat({uid, relationType: 'total', relationKey: 'total', periodType: 'week', periodValue: week, statValue: duration_ms})
    await table.writeStat({uid, relationType: 'total', relationKey: 'total', periodType: 'month', periodValue: month, statValue: duration_ms})
    // table.writeStat({uid, relationType: 'total', relationKey: 'total', periodType: 'moy', periodValue: moy, statValue: duration_ms})
    // table.writeStat({uid, relationType: 'total', relationKey: 'total', periodType: 'year', periodValue: year, statValue: duration_ms})
    await table.writeStat({uid, relationType: 'total', relationKey: 'total', periodType: 'life', periodValue: 'life', statValue: duration_ms})

    await table.writeStat({uid: 'global', relationType: 'total', relationKey: 'total', periodType: 'day', periodValue: day, statValue: duration_ms})
    await table.writeStat({uid: 'global', relationType: 'total', relationKey: 'total', periodType: 'week', periodValue: week, statValue: duration_ms})
    await table.writeStat({uid: 'global', relationType: 'total', relationKey: 'total', periodType: 'month', periodValue: month, statValue: duration_ms})
    await table.writeStat({uid: 'global', relationType: 'total', relationKey: 'total', periodType: 'life', periodValue: 'life', statValue: duration_ms})

    for (const artist of artists) {
      log.info('updating user and global stats for', {artist})
      await table.writeStat({uid, relationType: 'artist', relationKey: artist.id, periodType: 'day', periodValue: day, statValue: duration_ms, artist})
      await table.writeStat({uid, relationType: 'artist', relationKey: artist.id, periodType: 'week', periodValue: week, statValue: duration_ms, artist})
      await table.writeStat({uid, relationType: 'artist', relationKey: artist.id, periodType: 'month', periodValue: month, statValue: duration_ms, artist})
      await table.writeStat({uid, relationType: 'artist', relationKey: artist.id, periodType: 'life', periodValue: 'life', statValue: duration_ms, artist})

      await table.writeStat({uid: 'global', relationType: 'artist', relationKey: artist.id, periodType: 'day', periodValue: day, statValue: duration_ms, artist})
      await table.writeStat({uid: 'global', relationType: 'artist', relationKey: artist.id, periodType: 'week', periodValue: week, statValue: duration_ms, artist})
      await table.writeStat({uid: 'global', relationType: 'artist', relationKey: artist.id, periodType: 'month', periodValue: month, statValue: duration_ms, artist})
      await table.writeStat({uid: 'global', relationType: 'artist', relationKey: artist.id, periodType: 'life', periodValue: 'life', statValue: duration_ms, artist})
    }

    return
  }
  if (eventName === 'REMOVE') {
    log.info('Remove stat')
    return
  }
  log.warn('unknown event', { eventName, Keys })
}