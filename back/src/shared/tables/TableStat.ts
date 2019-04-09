import * as AWS from 'aws-sdk';
import * as moment from 'moment'

type RelationType = 'total' | 'artist'| 'genre'
type PeriodType = 'day' | 'dow' | 'week' | 'month' | 'moy' | 'year' | 'life'

export type Stat = {
  uid: string,
  relationType: RelationType,
  relationKey: string,
  periodType: PeriodType,
  periodValue: string,
  playDurationMs: number,
  // artist?: any,
  // genre?: any
}

export type StatTotal = Stat
export type StatArtist = Stat & {
  artist: { name: string, genres: string[] }
}
export type StatGenre = Stat & {
  genre: string
}

export const TableStat = (endpoint: string, TableName: string) => {
  const doc = new AWS.DynamoDB.DocumentClient({endpoint})

  const makePk = (uid: string, relationType: RelationType, periodType: PeriodType, periodValue: string) =>
    [uid, relationType, periodType, periodValue].join('#')

  const makeSk = (uid: string, periodType: PeriodType, relationKey: string) =>
    [uid, periodType, relationKey].join('#')

  const periodsFor = (isoDateString: string) => {
    const m = moment(isoDateString)
    return {
      day: m.format('YYYY-MM-DD'),
      dow: m.format('d'),
      week: m.format('YYYY-WW'),
      month: m.format('YYYY-MM'),
      moy: m.format('MM'),
      year: m.format('YYYY')
    }
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

  // const writeStat = async ({uid, relationType, relationKey, periodType, periodValue, statValue, artist, genre}: Stat) => {
  //   const doc = new AWS.DynamoDB.DocumentClient({endpoint})
  
  //   let UpdateExpression = artist ?
  //     'ADD playDurationMs :val SET artist = :artist' :
  //     'ADD playDurationMs :val'
  //   UpdateExpression = genre ?
  //     `${UpdateExpression} SET genre = :genre` :
  //     UpdateExpression

  //   const ExpressionAttributeValues = artist ?
  //     { ':val': statValue, ':artist': artist } :
  //     { ':val': statValue }

  //   if (genre) {
  //     ExpressionAttributeValues[':genre'] = genre
  //   }

  //   return await doc.update({
  //     TableName,
  //     Key: {
  //       pk: makePk(uid, relationType, periodType, periodValue),
  //       sk: makeSk(uid, periodType, relationKey)
  //     },
  //     UpdateExpression,
  //     ExpressionAttributeValues,
  //   }).promise()
  
  // }

  return {
    makePk,
    makeSk,
    periodsFor,
    // writeStat
    writeTotalStat,
    writeArtistStat,
    writeGenreStat,
  }
}