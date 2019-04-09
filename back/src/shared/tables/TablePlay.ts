import * as AWS from 'aws-sdk';

// not used yet

type PlayTrackAttrs = {
  uid: string
  playedAt: string
  track: {
    id: string
    name: string
    duration_ms: number
    artists: {
      id: string
      name: string
      images: {url: string}[]
      genres: string[]
    }[],
  }
}

type KeyAttrs = {
  pk: string,
  sk: string,
}

export type PlayTrack = PlayTrackAttrs & {
  uid: string
}

export type PlayTrackItem = KeyAttrs & {
  fk: string,
  playedAt: string,
  track: string,
}

export type PlayTrackImage = {
  pk: {
    S: string
  }
  sk: {
    S: string
  }
  playedAt: {
    S: string
  }
  track: {
    S: string
  }
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

  const decode = (image: PlayTrackImage): PlayTrackAttrs => ({
    uid: image.pk.S,
    playedAt: image.playedAt.S,
    track: JSON.parse(image.track.S), 
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
