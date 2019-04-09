import * as R from 'ramda'
import { DynamoDBStreamHandler, DynamoDBRecord } from "aws-lambda";
import { verifyEnv } from "../../shared/env";

import { slog } from "../logger";
import { TableStat } from "../../shared/tables/TableStat";
import { TablePlay, PlayTrackImage } from '../../shared/tables/TablePlay';
// import { SpotifyArtist } from '../../shared/SpotifyApi';

const log = slog.child({handler: 'onPlayUpdateGenreStats', awsEvent: 'ddbs'})

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

    const tablePlay = TablePlay(env.DYNAMO_ENDPOINT, "") // not actually writing anything, this is hacky af
    const { playedAt, track, uid } = tablePlay.decode(record.dynamodb.NewImage as PlayTrackImage)
    const { duration_ms: playDurationMs } = track
    log.info(`Updating Genre Stats ${track.name}`)

    const artists = track.artists
    // log.info('artists for this track:', {artists: artists.map(({name, genres, images})=>({name, genres, images}))})
    
    const g = artists.map(a=> a.genres)
    const genres = R.uniq(R.flatten<string>(g))
    log.info('genres from artists from this track', genres)

    const table = TableStat(env.DYNAMO_ENDPOINT, env.TABLE_STAT)
    const { day, week, month } = table.periodsFor(playedAt)

    for (const genre of genres) {
      if (!genre) {
        log.warn(`empty genre from track ${track.name}.  Artists: ${JSON.stringify(artists, null, 2)}`)
      } else {
        // log.info('updating user and global stats for', {genre})
        await table.writeGenreStat({uid, relationType: 'genre', relationKey: genre, periodType: 'day', periodValue: day, playDurationMs, genre})
        await table.writeGenreStat({uid, relationType: 'genre', relationKey: genre, periodType: 'week', periodValue: week, playDurationMs, genre})
        await table.writeGenreStat({uid, relationType: 'genre', relationKey: genre, periodType: 'month', periodValue: month, playDurationMs, genre})
        await table.writeGenreStat({uid, relationType: 'genre', relationKey: genre, periodType: 'life', periodValue: 'life', playDurationMs, genre})

        await table.writeGenreStat({uid: 'global', relationType: 'genre', relationKey: genre, periodType: 'day', periodValue: day, playDurationMs, genre})
        await table.writeGenreStat({uid: 'global', relationType: 'genre', relationKey: genre, periodType: 'week', periodValue: week, playDurationMs, genre})
        await table.writeGenreStat({uid: 'global', relationType: 'genre', relationKey: genre, periodType: 'month', periodValue: month, playDurationMs, genre})
        await table.writeGenreStat({uid: 'global', relationType: 'genre', relationKey: genre, periodType: 'life', periodValue: 'life', playDurationMs, genre})
      }
    }
    return
  }
  if (eventName === 'REMOVE') {
    log.info('Removed play')
    return
  }
  if (eventName === 'MODIFY') {
    log.warn('modified play', { Keys, newImage: record.dynamodb.NewImage, oldImage: record.dynamodb.OldImage})
  }
  log.warn('unknown event', { eventName, Keys })
}