import { APIGatewayProxyHandler } from 'aws-lambda';
import { SpotifyApi } from '../../shared/SpotifyApi';
import { verifyEnv } from '../../shared/env';

const scopes = [
  'user-read-recently-played',
  'user-top-read',
  'playlist-read-private',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-read-email',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'app-remote-control',
  'streaming',
  'user-follow-read',
  'user-follow-modify'
]

export const handler: APIGatewayProxyHandler = async (event) => {
  const env = verifyEnv({
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
  })
  const spotify = SpotifyApi(env) // we should really be passing spotify creds here imo

  const utcOffset = event.queryStringParameters['utcOffset']
  console.log('utcOffset', utcOffset)
  
  const Location = spotify.createAuthorizeURL(scopes, utcOffset)
  console.log('Location', Location)
  return {
    statusCode: 302,
    headers: {
      Location,
    },
    body: ""
  }
}