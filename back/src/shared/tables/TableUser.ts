import * as AWS from 'aws-sdk';
import * as winston from 'winston';
import * as t from 'io-ts';
import { decodeAll, decodeOne } from '../validation';
import * as R from 'ramda';
import { renameKeysWith } from 'ramda-adjunct'
import { TLogger } from '../../fns/logger';

const DocUserDerived = t.type({
  pk: t.string,
  sk: t.string,
})
const DocUserKeySource = t.type({
  uid: t.string,
})
const DocUserRequired = t.type({
  // uid: t.string,
  email: t.string,
  accessToken: t.string,
  refreshToken: t.string,
  spotifyId: t.string,
  utcOffset: t.number,
})
const DocUserUpdate = t.partial({
  email: t.string,
  accessToken: t.string,
  refreshToken: t.string,
  utcOffset: t.number,
})
const DocUserOptional = t.partial({
  lastUpdate: t.string,
  displayName: t.string,
  photoURL: t.string,
  totalUpdates: t.number,
})

const DocUser = t.intersection([DocUserKeySource, DocUserRequired, DocUserDerived, DocUserOptional])
export type TDocUser = t.TypeOf<typeof DocUser>

const NewDocUser = t.intersection([DocUserKeySource, DocUserRequired, DocUserOptional])
export type TNewDocUser = t.TypeOf<typeof NewDocUser>

const UpdateDocUser = t.intersection([DocUserKeySource, DocUserUpdate, DocUserOptional])
export type TUpdateDocUser = t.TypeOf<typeof UpdateDocUser>

// const renameKeys = R.curry((keysMap, obj) =>
//   R.reduce((acc, key) => R.assoc(keysMap[key] || key, obj[key], acc), {}, R.keys(obj))
// );

export const TableUser = (endpoint: string, TableName: string, log?: TLogger) => {
  log && log.info(`Referencing table [${TableName}] at [${endpoint}]`)
  const doc = new AWS.DynamoDB.DocumentClient({endpoint})

  const encode = (u: TNewDocUser): TDocUser => ({
    pk: u.uid,
    sk: 'spotify',
    ...u
  })

  // const decode = (obj: any): { errors: t.Errors, doc: TDocUser} => {
  //   const decoded = ImagePlay.decode(obj)
  //   const errors = decoded.isLeft() && decoded.value
  //   const image = decoded.isRight() && decoded.value


  //   uid: pk,
  //   ...vals
  // })
    
  const putUser = async (obj: TNewDocUser) => {
    log && log.info(`saving spotify credentials for user ${obj.uid}`)
    await doc.put({
      TableName,
      Item: encode(obj)
    }).promise()
  }

  const getAllSpotifyCreds = async () => {
    const result = await doc.scan({
      TableName,
    }).promise()
    return decodeAll(DocUser, result.Items)
  }

  const getUser = async (uid: string) => {
    const result = await doc.get({
      TableName,
      Key: { pk: uid, sk: 'spotify' },
    }).promise()
    return decodeOne(DocUser, result.Item)
  }

  const updateUser = async (obj: TUpdateDocUser) => {
    const { uid } = obj
    const nonNullKeys = Object.keys(obj).filter(k => obj[k])
    const UpdateExpression = 'SET ' + nonNullKeys.map(k => `${k} = :${k}`).join(', ')
    const nonNullObj: object = R.pickAll(nonNullKeys, obj)
    const ExpressionAttributeValues = renameKeysWith(k => `:${k}`, nonNullObj)
    await doc.update({
      TableName,
      Key: { pk: uid, sk: 'spotify' },
      UpdateExpression,
      ExpressionAttributeValues,
    }).promise()
  }

  const getSpotifyLastUpdate = async (uid: string) => {
    const result = await doc.get({
      TableName,
      Key: { pk: uid, sk: 'spotify' },
    }).promise()
    log && log.debug('TableUser result', result)
    return result.Item.lastUpdate
  }

  const updateSpotifyLastUpdate = async (uid: string, lastUpdate: string ) => {
    log && log.info(`updating lastUpdate for uid ${uid} to ${lastUpdate}`)
    await doc.update({
      TableName,
      Key: { pk: uid, sk: 'spotify' },
      UpdateExpression: 'ADD totalUpdates :v SET lastUpdate = :lastUpdate',
      ExpressionAttributeValues: {
        ":v": 1,
        ':lastUpdate': lastUpdate,
      }
    }).promise()
  }

  return {
    encode,
    getUser,
    putUser,
    updateUser,
    getAllSpotifyCreds,
    updateSpotifyLastUpdate,
    getSpotifyLastUpdate
  }
}
