
import * as SpotifyWebApi from 'spotify-web-api-node'

// new versions incl user and client authd

export type SpotifyPlay = {
  played_at: string,
  track: SpotifyTrack,
}

export type SpotifyTrack = {
  id: string,
  name: string,
  duration_ms: number,
  album: SpotifyAlbum,
  artists: SpotifyArtist[],
}

export type SpotifyAlbum = {
  name: string,
}

export type SpotifyArtist = {
  id: string,
  name: string,
  genres: string[]
}

type BodyResponse<T> = Promise<{ body: T }>

const spotifyClientCredentials = () => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } = process.env
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI) {
    throw new Error("Need SPOTIFY_* env vars")
  }
  return {
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUri: SPOTIFY_REDIRECT_URI,
  }
}

export const SpotifyApi = (accessToken?: string, refreshToken?: string) => {
  const _api = new SpotifyWebApi(spotifyClientCredentials())
  if (accessToken && refreshToken) {
    _api.setAccessToken(accessToken)
    _api.setRefreshToken(refreshToken)
  }

  const rethrow = <T>(fn: () => Promise<T>): Promise<T> => {
    return fn().catch(err => {
      const e = new Error()
      e.message = err.message
      e.name = err.name
      throw e
    })
  }

  const authorizationCodeGrant = _api.authorizationCodeGrant.bind(_api)
  const setAccessToken = _api.setAccessToken.bind(_api)
  const setRefreshToken = _api.setRefreshToken.bind(_api)
  const createAuthorizeURL = _api.createAuthorizeURL.bind(_api)
  const getArtists = _api.getArtists.bind(_api)

  type MeResult = {
    display_name: string
    email: string
    id: string
    images: {url: string}[]
  }
  const getMe = () => {
    return rethrow(() => _api.getMe() as BodyResponse<MeResult>)
  }

  type RefreshAccessTokenResult = { access_token: string }
  const refreshAccessToken = () => {
    return rethrow(() => _api.refreshAccessToken() as BodyResponse<RefreshAccessTokenResult>)
  }

  type GetMyRecentlyPlayedTracksResult = { items: SpotifyPlay[] }
  const getMyRecentlyPlayedTracks = async (...args) => {
    return rethrow(async () => {
      try {
        console.log('getMyRecentlyPlayedTracks')
        // need to await this result to get the auth error
        return await _api.getMyRecentlyPlayedTracks(...args) as BodyResponse<GetMyRecentlyPlayedTracksResult>
      } catch (err) {
        console.log('refreshing access token')
        // refresh access token then try one more time
        const { body: { access_token } } = await refreshAccessToken()
        console.log('new access token', access_token)
        _api.setAccessToken(access_token)
        return await _api.getMyRecentlyPlayedTracks(...args) as BodyResponse<GetMyRecentlyPlayedTracksResult>
      }
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
