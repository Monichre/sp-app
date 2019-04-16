import * as AWS from 'aws-sdk';
import * as t from 'io-ts';
import { isRight, isLeft } from 'fp-ts/lib/Either';

// doc decoders used for input/output for aws docclient
const DocPlayTrackArtist = t.type({
  id: t.string,
  name: t.string,
  images: t.array(t.type({ url: t.string })),
  genres: t.array(t.string),
  external_urls: t.type({ spotify: t.string })
})

const DocPlayTrack = t.type({
  id: t.string,
  name: t.string,
  duration_ms: t.number,
  artists: t.array(DocPlayTrackArtist),
  album: t.type({
    name: t.string,
    images: t.array(t.type({
      url: t.string,
    }))
  })
})

const DocPlayDerived = t.type({
  pk: t.string,
  sk: t.string,
  fk: t.string,
})

const DocPlayRequired = t.type({
  uid: t.string,
  playedAt: t.string,
  track: DocPlayTrack,
})

const DocPlay = t.intersection([DocPlayRequired, DocPlayDerived])
export type TDocPlay = t.TypeOf<typeof DocPlay>

const NewDocPlay = DocPlayRequired
export type TNewDocPlay = t.TypeOf<typeof NewDocPlay>

// image decoders used for ddb streams
const ImagePlay = t.type({
  pk: t.type({
    S: t.string,
  }),
  sk: t.type({
    S: t.string,
  }),
  fk: t.type({
    S: t.string,
  }),
  uid: t.type({
    S: t.string,
  }),
  playedAt: t.type({
    S: t.string,
  }),
  track: t.type({
    M: t.type({
      id: t.type({
        S: t.string
      }),
      name: t.type({
        S: t.string
      }),
      duration_ms: t.type({
        N: t.string
      }),
      artists: t.type({
        L: t.array(t.type({
          M: t.type({
            id: t.type({
              S: t.string
            }),
            name: t.type({
              S: t.string
            }),
            images: t.type({
              L: t.array(t.type({
                M: t.type({
                  url: t.type({
                    S: t.string
                  })
                })
              }))
            }),
            genres: t.type({
              L: t.array(t.type({
                S: t.string
              })),
            }),
            external_urls: t.type({
              M: t.type({
                spotify: t.type({
                  S: t.string
                })
              })
            })
          })
        }))
      }),
      album: t.type({
        M: t.type({
          name: t.type({
            S: t.string,
          }),
          images: t.type({
            L: t.array(t.type({
              M: t.type({
                url: t.type({
                  S: t.string
                })
              })
            }))
          })
        })
      })
    }),
  }),
})

export type TImagePlay = t.TypeOf<typeof ImagePlay>

export const TablePlay = (endpoint: string, TableName: string) => {
  const doc = new AWS.DynamoDB.DocumentClient({endpoint})

  const encode = (play: TNewDocPlay): TDocPlay => ({
    pk: play.uid,
    sk: `track#${play.playedAt}`,
    fk: `${play.track.id}#${play.playedAt}`,
    ...play
  })

  const decode = (obj: any) => {
    const decoded = ImagePlay.decode(obj)
    const invalid = isLeft(decoded) ? { errors: decoded.value, item: obj} : null
    const image: TImagePlay | null = isRight(decoded) && decoded.value || null
    const valid: TDocPlay | false = image && {
      pk: image.pk.S,
      sk: image.sk.S,
      fk: image.fk.S,
      uid: image.uid.S,
      playedAt: image.playedAt.S,
      track: {
        id: image.track.M.id.S,
        name: image.track.M.name.S,
        duration_ms: parseInt(image.track.M.duration_ms.N),
        artists: image.track.M.artists.L.map(ai => ({
          id: ai.M.id.S,
          name: ai.M.name.S,
          images: ai.M.images.L.map(aii => ({
            url: aii.M.url.S,
          })),
          genres: ai.M.genres.L.map(g => g.S),
          external_urls: {
            spotify: ai.M.external_urls.M.spotify.S
          }
        })),
        album: {
          name: image.track.M.album.M.name.S,
          images: image.track.M.album.M.images.L.map(ai => ({
            url: ai.M.url.S
          }))
        }
      }
    }
    return { valid, invalid }
  }
    
  const putPlay = async (obj: TNewDocPlay) => {
    await doc.put({
      TableName,
      Item: encode(obj)
    }).promise()
  }

  const getRecentPlays = async (uid: string, Limit = 100) => {
    const result = await doc.query({
      TableName,
      KeyConditionExpression: 'pk = :p and begins_with(sk, :s)',
      ScanIndexForward: false,
      ExpressionAttributeValues: {
        ':p': uid,
        ':s': `track#`
      },
      Limit,
    }).promise()
    const decoded = result.Items.map(DocPlay.decode)
    const docs = decoded.filter(isRight).map(d => d.value)
    const errors = decoded.filter(isLeft).map(d => d.value)
    return { docs, errors }
  }

  return {
    encode,
    decode,
    putPlay,
    getRecentPlays,
  }
}
