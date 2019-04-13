import * as AWS from 'aws-sdk';
import * as winston from 'winston';
import * as t from 'io-ts';
import { isRight, isLeft } from 'fp-ts/lib/Either';
import { decodeAll, decodeOne } from '../validation';

const DocUser = t.type({
  pk: t.string,
  sk: t.string,
  uid: t.string,
  accessToken: t.string,
  refreshToken: t.string,
  spotifyId: t.string,
  utcOffset: t.number,
})

type TDocUser = t.TypeOf<typeof DocUser>

const NewDocUser = t.type({
  uid: t.string,
  accessToken: t.string,
  refreshToken: t.string,
  spotifyId: t.string,
  utcOffset: t.number,
})

type TNewDocUser = t.TypeOf<typeof NewDocUser>

export const TableUser = (endpoint: string, TableName: string, log?: winston.Logger) => {
  log && log.info(`Referencing table [${TableName}] at [${endpoint}]`)
  const doc = new AWS.DynamoDB.DocumentClient({endpoint})

  // newDoc
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
    
  const setSpotifyCreds = async (obj: TNewDocUser) => {
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

  const setUser = async (u: TNewDocUser) => {
    await doc.put({
      TableName,
      Item: encode(u)
    }).promise()
  }

  const getUser = async (uid: string) => {
    const result = await doc.get({
      TableName,
      Key: { pk: uid, sk: 'spotify' },
    }).promise()
    return decodeOne(DocUser, result.Item)
    // log && log.debug('TableUser result', result)
    // const decoded = DocUser.decode(result.Item)
    // const user = decoded.isRight() && decoded.value
    // const error = decoded.isLeft() && decoded.value
    // return { user, error }
  }

  // const getSpotifyCreds = async (uid: string) => {
  //   const result = await doc.get({
  //     TableName,
  //     Key: { pk: uid, sk: 'spotify' },
  //   }).promise()
  //   log && log.debug('TableUser result', result)
  //   return decode(result.Item as UserSpotifyCredsItem)
  // }

  const getSpotifyLastUpdate = async (uid: string) => {
    const result = await doc.get({
      TableName,
      Key: { pk: uid, sk: 'spotify' },
    }).promise()
    log && log.debug('TableUser result', result)
    return result.Item.lastUpdate
  }

  const setSpotifyLastUpdate = async (uid: string, lastUpdate: string ) => {
    log && log.info(`updating lastUpdate for uid ${uid} to ${lastUpdate}`)
    await doc.update({
      TableName,
      Key: { pk: uid, sk: 'spotify' },
      UpdateExpression: 'set lastUpdate = :lastUpdate',
      ExpressionAttributeValues: {
        ':lastUpdate': lastUpdate,
      }
    }).promise()
  }

  return {
    encode,
    // decode,
    getUser,
    setSpotifyCreds,
    getAllSpotifyCreds,
    // getSpotifyCreds,
    setSpotifyLastUpdate,
    getSpotifyLastUpdate
  }
}
