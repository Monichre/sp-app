import { APIGatewayProxyHandler } from 'aws-lambda';
import { api } from './api'

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
  const spotify = api()
  const state = 'test'
  const Location = spotify.createAuthorizeURL(scopes, state)

  return {
    statusCode: 302,
    headers: {
      Location,
    },
    body: ""
  }
}