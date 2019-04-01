import * as AWS from 'aws-sdk';

type UserSpotifyAttrs = {
  accessToken: string
  refreshToken: string
  spotifyId: string
}

type KeyAttrs = {
  pk: string,
  sk: string,
}

type UserSpotifyCreds = UserSpotifyAttrs & {
  uid: string
}

type UserSpotifyCredsItem = KeyAttrs & UserSpotifyAttrs

export const TableUser = (endpoint: string, TableName: string) => {
  console.log(`Referencing table [${TableName}] at [${endpoint}]`)
  const doc = new AWS.DynamoDB.DocumentClient({endpoint})

  const encode = ({uid, ...vals}: UserSpotifyCreds): UserSpotifyCredsItem => ({
    pk: uid,
    sk: 'spotify',
    ...vals
  })

  const decode = ({pk, sk, ...vals}: UserSpotifyCredsItem): UserSpotifyCreds => ({
    uid: pk,
    ...vals
  })
    
  const setSpotifyCreds = async (obj: UserSpotifyCreds) => {
    console.log(`saving spotify credentials for user ${obj.uid}`)
    await doc.put({
      TableName,
      Item: encode(obj)
    }).promise()
  }

  const getAllSpotifyCreds = async () => {
    const result = await doc.scan({
      TableName,
    }).promise()
    return result.Items.map(decode)
  }

  const getSpotifyCreds = async (uid: string) => {
    const result = await doc.get({
      TableName,
      Key: { pk: uid, sk: 'spotify' },
    }).promise()
    console.log('TableUser result', result)
    return decode(result.Item as UserSpotifyCredsItem)
  }

  const getSpotifyLastUpdate = async (uid: string) => {
    const result = await doc.get({
      TableName,
      Key: { pk: uid, sk: 'spotify' },
    }).promise()
    console.log('TableUser result', result)
    return result.Item.lastUpdate
  }

  const setSpotifyLastUpdate = async (uid: string, lastUpdate: string ) => {
    console.log(`updating lastUpdate for uid ${uid} to ${lastUpdate}`)
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
    decode,
    setSpotifyCreds,
    getAllSpotifyCreds,
    getSpotifyCreds,
    setSpotifyLastUpdate,
    getSpotifyLastUpdate
  }
}
