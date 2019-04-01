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
  statValue: number,
}

export const TableStat = (endpoint: string, TableName: string) => {
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

  const writeStat = async ({uid, relationType, relationKey, periodType, periodValue, statValue}: Stat) => {
    const doc = new AWS.DynamoDB.DocumentClient({endpoint})
  
    return await doc.update({
      TableName,
      Key: {
        pk: makePk(uid, relationType, periodType, periodValue),
        sk: makeSk(uid, periodType, relationKey)
      },
      UpdateExpression: 'ADD playDurationMs :val',
      ExpressionAttributeValues: {
        ':val': statValue
      }
    }).promise()
  
  }

  return {
    makePk,
    makeSk,
    periodsFor,
    writeStat
  }
}