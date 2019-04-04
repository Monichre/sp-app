import * as AWS from 'aws-sdk';
import * as R from 'ramda'
import { SQSHandler } from "aws-lambda";
import { SpotifyApi, SpotifyPlay, SpotifyArtist } from "../shared/SpotifyApi";
import { verifyEnv } from "../shared/env";
import { QueueFetchSpotifyPlays } from "../shared/queues";
import { TableUser } from '../shared/tables/TableUser';

import { slog } from "./logger";
const log = slog.child({handler: 'fetchSpotifyPlays', awsEvent: 'sqs'})

// trimming off ms greatly reduces spurious repeat results from spotify api
const sanitizeSpotifyPlayedAt = (p: string) => `${p.split('.')[0]}.000Z`

const wait = async (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

export const handler: SQSHandler = async (event) => {
  // ALWAYS DO THIS FIRST -- with sls offline, discovered some cases where process.env vars clobber each other
  // which is a particularly savory flavor of hell let me tell you
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    TABLE_TARGET: process.env.TABLE_TARGET,
    TABLE_USER: process.env.TABLE_USER,
  }, log)

  // the queue message tells us about the user we're fetching for
  // we should only get one record per message, nu?
  const { uid , accessToken, refreshToken } = QueueFetchSpotifyPlays.extract(event)[0]

  // use the spotify api to get recent plays
  const api = SpotifyApi(accessToken, refreshToken)

  // for primate-testing onboarding workflow, put a 3-second delay in front of this
  // await wait(3000)
  
  const { body: { items }} = await api.getMyRecentlyPlayedTracks({ limit: 50 })

  if (items.length > 0) {

    log.info(`api returned ${items.length} items`)
    // ok so here is where we really want to enrich the play records with addl artist data
    // and/or cache the info
    // first collect all unique artist ids from all the play records
    // there's some ramda magic that will one-line that
    const getArtistIds = R.compose(
      R.uniq,
      R.map(R.prop('id')),
      R.flatten,
      R.map(R.path(['track', 'artists'])),
    )
    const artistIds = getArtistIds(items)
    log.warn('artist ids', { artistIds })

    // make a getArtists call with all their ids to get the enrichment data (images, genres)
    const { body: { artists }} = await api.getArtists(artistIds) as { body: { artists:  SpotifyArtist[] }}

    // log.warn('got enriched artist data', {artists})
    // return a play.map of artists to enriched artist data

    const enrichedItems = items.map(i => ({
      played_at: i.played_at,
      track: {
        ...i.track,
        artists: i.track.artists.map(ta => artists.find(ea => ea.id === ta.id))
      }
    }))
    // write all the results to the table
    log.info(`Play table [${env.TABLE_TARGET}] at [${env.DYNAMO_ENDPOINT}]`)
    const doc = new AWS.DynamoDB.DocumentClient({endpoint: env.DYNAMO_ENDPOINT})
    const TableName = env.TABLE_TARGET
    for (const item of enrichedItems) {
      const playedAt = sanitizeSpotifyPlayedAt(item.played_at)
      // we should only write if the playedAt is more recent than the user's lastPlayedAt
      // and we should collect these and do a batch write
      try {
        const result = await doc.put({
          TableName,
          Item: {
            pk: uid,
            sk: `track#${playedAt}`,
            fk: `${item.track.id}#${playedAt}`,
            playedAt,
            track: JSON.stringify(item.track)
          }
        }).promise()
        log.info(`saved ${item.track.name}`)
      } catch (err) {
        log.error('error writing api fetch result', err)
      }
    }

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
