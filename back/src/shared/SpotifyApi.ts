import * as SpotifyWebApi from 'spotify-web-api-node'
import * as t from 'io-ts'
import { left } from 'fp-ts/lib/Either';

type BodyResponse<T> = Promise<{ body: T }>

const ResponseBody = <B extends t.Mixed>(body: B) =>
  t.interface({ body })

const SpotifyImage = t.type({
  url: t.string,
})
export type TSpotifyImage = t.TypeOf<typeof SpotifyImage>

const SpotifyAlbum = t.type({
  id: t.string,
  name: t.string,
  images: t.array(SpotifyImage)
})

const SpotifyArtistTerse = t.type({
  id: t.string,
  name: t.string,
})
export type TSpotifyArtistTerse = t.TypeOf<typeof SpotifyArtistTerse>

const SpotifyArtistVerbose = t.type({
  id: t.string,
  name: t.string,
  genres: t.array(t.string),
  images: t.array(SpotifyImage),
  external_urls: t.type({ spotify: t.string })
})
export type TSpotifyArtistVerbose = t.TypeOf<typeof SpotifyArtistVerbose>

export const SpotifyTrack = t.type({
  id: t.string,
  duration_ms: t.number,
  name: t.string,
  artists: t.array(SpotifyArtistTerse),
  album: SpotifyAlbum,
})
export type TSpotifyTrack = t.TypeOf<typeof SpotifyTrack>

export const SpotifyTrackVerbose = t.type({
  id: t.string,
  duration_ms: t.number,
  name: t.string,
  artists: t.array(SpotifyArtistVerbose),
  album: SpotifyAlbum,
})
export type TSpotifyTrackVerbose = t.TypeOf<typeof SpotifyTrackVerbose>

export const SpotifyPlay = t.type({
  played_at: t.string, // iso date string!
  track: SpotifyTrack,
})
export type TSpotifyPlay = t.TypeOf<typeof SpotifyPlay>

export const SpotifyPlayVerbose = t.type({
  played_at: t.string, // iso date string!
  track: SpotifyTrackVerbose,
})
export type TSpotifyPlayVerbose = t.TypeOf<typeof SpotifyPlayVerbose>

const SpotifyGetMyRecentlyPlayedTracksResponse = ResponseBody(t.type({
  items: t.array(SpotifyPlay)
}))
export type TSpotifyGetMyRecentlyPlayedTracksResponse = t.TypeOf<typeof SpotifyGetMyRecentlyPlayedTracksResponse>

const SpotifyGetArtistsResponse = ResponseBody(t.type({
  artists: t.array(SpotifyArtistVerbose)
}))

export type SpotifyClientEnv = {
  SPOTIFY_CLIENT_ID: string,
  SPOTIFY_CLIENT_SECRET: string,
  SPOTIFY_REDIRECT_URI: string,
}

const envToOptions = (env: SpotifyClientEnv) => ({
  clientId: env.SPOTIFY_CLIENT_ID,
  clientSecret: env.SPOTIFY_CLIENT_SECRET,
  redirectUri: env.SPOTIFY_REDIRECT_URI,
})

export const SpotifyApi = (env: SpotifyClientEnv, accessToken?: string, refreshToken?: string) => {
  console.log('TCL: SpotifyApi -> refreshToken', refreshToken)
  console.log('TCL: SpotifyApi -> accessToken', accessToken)
  const _api = new SpotifyWebApi(envToOptions(env))
  console.log('TCL: SpotifyApi -> _api', _api)
  
  if (accessToken && refreshToken) {
    _api.setAccessToken(accessToken)
    _api.setRefreshToken(refreshToken)
  }

  const rethrow = async <T>(fn: () => Promise<T>): Promise<T> => {
    return await fn().catch(err => {
      console.log('TCL: SpotifyApi -> err', err)
      const e = new Error()
      e.message = err.message
      e.name = err.name
      throw e
    })
  }

  const authorizationCodeGrant = _api.authorizationCodeGrant.bind(_api)
  console.log('TCL: SpotifyApi -> authorizationCodeGrant', authorizationCodeGrant)
  const setAccessToken = _api.setAccessToken.bind(_api)
  const setRefreshToken = _api.setRefreshToken.bind(_api)
  const createAuthorizeURL = _api.createAuthorizeURL.bind(_api)

  type MeResult = {
    display_name: string
    email: string
    id: string
    images: {url: string}[]
  }
  const getMe = async () => await _api.getMe() as BodyResponse<MeResult>
  // {
  //   console.log('Hey im inside get me')
  //   return await rethrow(async () => {
  //     const meData = await _api.getMe() as BodyResponse<MeResult>
  //     console.log('TCL: getMe -> meData', meData)
  //     return meData
      
  //   })
  // }

  type RefreshAccessTokenResult = { access_token: string }
  const refreshAccessToken = () => {
    return rethrow(() => _api.refreshAccessToken() as BodyResponse<RefreshAccessTokenResult>)
  }

  const getArtists = async (...args) => {
    return rethrow(async () => {
      let result: any
      try {
        result = await _api.getArtists(...args)

      } catch (err) {
        try {
          const { body: { access_token } } = await refreshAccessToken()
          console.log('new access token', access_token)
          _api.setAccessToken(access_token)
          result = await _api.getArtists(...args) // as BodyResponse<GetMyRecentlyPlayedTracksResult>
        } catch (error) {
          console.log('spotify api error', error)
          return left<Error, TSpotifyArtistVerbose[]>(error)
        }

      }
      return SpotifyGetArtistsResponse.decode(result).map(({body: { artists }})=>artists)
    })
  }

  const getMyRecentlyPlayedTracks = async (...args) => {
    return rethrow(async () => {
      let result: any // t.TypeOf<typeof SpotifyGetMyRecentlyPlayedTracksResponse>
      try {
        console.log('getMyRecentlyPlayedTracks')
        // need to await this result to get the auth error
        result = await _api.getMyRecentlyPlayedTracks(...args) // as BodyResponse<GetMyRecentlyPlayedTracksResult>
      } catch (err) {
        try { // this is dumb as balls
          console.log('refreshing access token')
          // refresh access token then try one more time
          const { body: { access_token } } = await refreshAccessToken()
          console.log('new access token', access_token)
          _api.setAccessToken(access_token)
          result = await _api.getMyRecentlyPlayedTracks(...args) // as BodyResponse<GetMyRecentlyPlayedTracksResult>
        } catch (error) {
          console.log('spotify api error', error)
          return left<Error, TSpotifyPlay[]>(error)
        }
      }
      return SpotifyGetMyRecentlyPlayedTracksResponse.decode(result).map(({body: { items }})=>items)
    })
  }

  return {
    authorizationCodeGrant,
    setAccessToken,
    setRefreshToken,
    createAuthorizeURL,
    getMe,
    refreshAccessToken,    
    getMyRecentlyPlayedTracks,
    getArtists,
  }
}
