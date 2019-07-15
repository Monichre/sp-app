import * as AWS from 'aws-sdk';
import * as moment from 'moment'
import * as R from 'ramda'
import { UpdateItemOutput } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk';

export type PeriodType =
	| 'day'
	| 'dow'
	| 'week'
	| 'month'
	| 'moy'
	| 'year'
	| 'life'

export type RelationType = 'total' | 'artist' | 'genre' | 'user'

export type TopKeys = {
	uid: string
	periodType: PeriodType
	periodValue: string
	Limit: number
}

export type StatKeys = {
	uid: string
	periodType: PeriodType
	periodValue: string
}

export type ArtistStatKeys = {
	uid: string
	artistId: string
	periodType: PeriodType
	periodValue: string
}

export type GenreStatKeys = {
	uid: string
	genre: string
	periodType: PeriodType
	periodValue: string
}

export type AchievementType =
	| 'topListener'
	| 'firstToStream'
	| 'secondPlaceListener'
	| 'thirdPlaceListener'

export type Achievement = {
	artistId: string
	uid: string
	achievementType: AchievementType
	periodType: PeriodType
	periodValue: string
	total: number
}

export type AchievementMetric = {
	uid: string
	achievementType: AchievementType
	artistId: string
	periodType: PeriodType
	periodValue: string
	playDurationMs: number
	artist: { name: string; id: string }
	user: { name: string; id: string }
}

export type Stat = {
  uid: string,
  relationType: RelationType,
  relationKey: string,
  periodType: PeriodType,
  periodValue: string,
  playDurationMs: number,
}

export type StatTotal = Stat
export type StatArtist = Stat & {
  artist: { name: string, genres: string[] }
}
export type StatArtistAndUser = Stat & StatArtist & {
	user: { id: string; img: string }
}
export type StatGenre = Stat & {
  genre: string
}
type Artist = {
  id: string,
  name: string,
  images: Image[],
  external_urls: SpotifyUrl
  genres: string[]
}
type SpotifyUrl = {
  spotify: string
}
type Image = {
  url: string
}

type TimeseriesKeys = {
  uid: string
  relationType: RelationType
  relationId: string
  periodType: PeriodType
  startPeriod: string
  endPeriod: string
}
type Timeseries = {
  playDurationMs: number
  period: string
}

export type TTableStat = {
  makePk: (uid: string, relationType: RelationType, periodType: PeriodType, periodValue: string) => string
  makeSk: (uid: string, periodType: PeriodType, relationKey: string) => string
  periodsFor: (isoDateString: string) => { day: string, dow: string, week: string, month: string, moy: string, year: string, life: string}
  getTimeseries: (timeseriesKeys: TimeseriesKeys) => Promise<Timeseries[]>
  getStat: (statKeys: StatKeys) => Promise<number>
  getTopGenres: (topKeys: TopKeys) => Promise<TopGenreRow[]>
  getGenreStat: (genreStatKeys: GenreStatKeys) => Promise<number>
  getArtistInfo: (artistId: string) => Promise<Artist>
  getTopArtists: (topKeys: TopKeys) => Promise<TopArtistsRow[]>
  getArtistStat: (artistStatKeys: ArtistStatKeys) => Promise<number>
  writeTotalStat: (stat: StatTotal) => Promise<PromiseResult<UpdateItemOutput, AWSError>>
  writeArtistStat: (stat: StatArtist) => Promise<PromiseResult<UpdateItemOutput, AWSError>>
  writeGenreStat: (stat: StatGenre) => Promise<PromiseResult<UpdateItemOutput, AWSError>>
}

type TopArtistsRow = {
  artist: Artist,
  playDurationMs: number,
}
type TopGenreRow = {
  genre: string,
  playDurationMs: number,
}
const byTimeThenArtistName = R.sortWith<TopArtistsRow>([
  R.descend(R.prop('playDurationMs')),
  R.ascend(R.path(['artist', 'name']))
])
const byTimeThenGenre = R.sortWith<TopGenreRow>([
  R.descend(R.prop('playDurationMs')),
  R.ascend(R.prop('genre'))
])

const byPeriod = R.sortWith<Timeseries>([
  R.ascend(R.path(['period']))
])


export const TableStat = (endpoint: string, TableName: string): TTableStat => {
  const doc = new AWS.DynamoDB.DocumentClient({endpoint})

  const makePk = (uid: string, relationType: RelationType, periodType: PeriodType, periodValue: string) =>
    [uid, relationType, periodType, periodValue].join('#')

  const makeSk = (uid: string, periodType: PeriodType, relationKey: string) =>
    [uid, periodType, relationKey].join('#')

  const periodsFor = (isoDateString: string) => {
    const m = moment.parseZone(isoDateString)
    return {
      day: m.format('YYYY-MM-DD'),
      dow: m.format('d'),
      week: m.format('YYYY-WW'),
      month: m.format('YYYY-MM'),
      moy: m.format('MM'),
      year: m.format('YYYY'),
      life: 'life'
    }
  }

  const getTimeseries = async ({uid, relationId, relationType, periodType, startPeriod, endPeriod}: TimeseriesKeys): Promise<Timeseries[]> => {
    const sk = [uid, periodType, relationId].join('#')
    const startPk = [uid, relationType, periodType, startPeriod].join('#')
    const endPk = [uid, relationType, periodType, endPeriod].join('#')
    // console.log('getting stats for', { sk, startPk, endPk })

    const params = {
      TableName,
      // Limit,
      KeyConditionExpression: `sk = :sk and pk BETWEEN :s and :e`,
      IndexName: 'GSIReverse',
      // ScanIndexForward: false,
      ExpressionAttributeValues: {
        ':sk': sk,
        ':s': startPk,
        ':e': endPk
      }
    }
    const result = await doc.query(params).promise()
      .then(d => d.Items.map(i => ({
        // artist: i.artist,
        period: i.pk.split('#')[3],
        playDurationMs: i.playDurationMs
      })))
      .then(byPeriod)
    // console.log('artistStatsFor', uid, id, result)
    return result
  }

  const getStat = async ({uid, periodType, periodValue}: StatKeys) => {
    return await doc.get({
      TableName,
      Key: {
        pk: [uid, 'total', periodType, periodValue].join('#'),
        sk: [uid, periodType, 'total'].join('#'),
      }
    }).promise().then(r => r.Item && r.Item.playDurationMs as number || 0)
  }
    
  const getTopGenres = async ({uid, periodType, periodValue, Limit = 5}: TopKeys) => {
    const params = {
      TableName,
      Limit,
      KeyConditionExpression: `pk = :pk`,
      IndexName: 'LSIPlayDuration',
      ScanIndexForward: false,
      ExpressionAttributeValues: {
        ':pk': [uid, 'genre', periodType, periodValue].join('#')
      }
    }
    return await doc.query(params).promise()
      .then(d => d.Items.map(i => ({genre: i.genre, playDurationMs: i.playDurationMs})))
      .then(byTimeThenGenre)
  }

  const getGenreStat = async ({uid, genre, periodType, periodValue}: GenreStatKeys) => {
    return await doc.get({
      TableName,
      Key: {
        pk: makePk(uid, 'genre', periodType, periodValue),
        sk: makeSk(uid, periodType, genre)
      }
    }).promise().then(r => r.Item && r.Item.playDurationMs as number || 0)
  }

  const getArtistInfo = async (artistId: string): Promise<Artist> => {
    return await doc.get({
      TableName,
      Key: {
        pk: makePk('global', 'artist', 'life', 'life'),
        sk: makeSk('global', 'life', artistId)
      }
    }).promise().then(r => r.Item && r.Item.artist as Artist)
  }


  const getTopArtists = async ({uid, periodType, periodValue, Limit = 5}: TopKeys) => {
    const params = {
      TableName,
      Limit,
      KeyConditionExpression: `pk = :pk`,
      IndexName: 'LSIPlayDuration',
      ScanIndexForward: false,
      ExpressionAttributeValues: {
        ':pk': [uid, 'artist', periodType, periodValue].join('#')
      }
    }
    return await doc.query(params).promise()
      .then(d => d.Items.map(i => ({artist: i.artist, playDurationMs: i.playDurationMs})))
      .then(byTimeThenArtistName)
  }

  const getArtistStat = async ({uid, artistId, periodType, periodValue}: ArtistStatKeys) => {
    return await doc.get({
      TableName,
      Key: {
        pk: makePk(uid, 'artist', periodType, periodValue),
        sk: makeSk(uid, periodType, artistId)
      }
    }).promise().then(r => r.Item && r.Item.playDurationMs as number || 0)
  }

  const writeTotalStat = async ({uid, relationType, relationKey, periodType, periodValue, playDurationMs}: StatTotal) => {
    return await doc.update({
      TableName,
      Key: {
        pk: makePk(uid, relationType, periodType, periodValue),
        sk: makeSk(uid, periodType, relationKey)
      },
      UpdateExpression: 'ADD playDurationMs :v',
      ExpressionAttributeValues: { ':v': playDurationMs },
    }).promise()
  }

  const writeArtistStat = async ({uid, relationType, relationKey, periodType, periodValue, playDurationMs, artist}: StatArtist) => {
    return await doc.update({
      TableName,
      Key: {
        pk: makePk(uid, relationType, periodType, periodValue),
        sk: makeSk(uid, periodType, relationKey)
      },
      UpdateExpression: 'ADD playDurationMs :v SET artist = :a',
      ExpressionAttributeValues: { ':v': playDurationMs, ':a': artist },
    }).promise()
  }

  const writeGenreStat = async ({uid, relationType, relationKey, periodType, periodValue, playDurationMs, genre}: StatGenre) => {
    return await doc.update({
      TableName,
      Key: {
        pk: makePk(uid, relationType, periodType, periodValue),
        sk: makeSk(uid, periodType, relationKey)
      },
      UpdateExpression: 'ADD playDurationMs :v SET genre = :g',
      ExpressionAttributeValues: { ':v': playDurationMs, ':g': genre },
    }).promise()
  }

  return {
    makePk,
    makeSk,
    periodsFor,
    getTimeseries,
    getStat,
    getTopGenres,
    getGenreStat,
    getArtistInfo,
    getTopArtists,
    getArtistStat,
    writeTotalStat,
    writeArtistStat,
    writeGenreStat,
  }
}