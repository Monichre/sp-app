import * as AWS from 'aws-sdk';

// not used yet

type PlayTrackAttrs = {
  uid: string
  playedAt: string,
  track: {
    id: string,
    name: string,
    artists: {
      id: string,
      name: string
    }[],
  }
}

type KeyAttrs = {
  pk: string,
  sk: string,
}

type PlayTrack = PlayTrackAttrs & {
  uid: string
}

type PlayTrackItem = KeyAttrs & {
  fk: string,
  playedAt: string,
  track: string,
}

export const TablePlay = (endpoint: string, TableName: string) => {
  const doc = new AWS.DynamoDB.DocumentClient({endpoint})

  const encode = ({uid, playedAt, track}: PlayTrackAttrs): PlayTrackItem => ({
    pk: uid,
    sk: `track#${playedAt}`,
    fk: `${track.id}#${playedAt}`,
    playedAt,
    track: JSON.stringify(track),
  })

  const decode = ({pk, playedAt, track}: PlayTrackItem): PlayTrackAttrs => ({
    uid: pk,
    playedAt,
    track: JSON.parse(track), 
  })
    
  const setPlayTrack = async (obj: PlayTrack) => {
    await doc.put({
      TableName,
      Item: encode(obj)
    })
  }

  const x = async () => {
    const result = await doc.scan({
      TableName,
    }).promise()
    return result.Items.map(decode)
  }

  return {
    encode,
    decode,
    setPlayTrack,
    x,
  }
}
