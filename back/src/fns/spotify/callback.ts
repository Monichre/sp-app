import { APIGatewayProxyHandler } from 'aws-lambda';

import { SpotifyApi } from '../../shared/SpotifyApi'
import { TableUser } from '../../shared/tables/TableUser';
import { verifyEnv } from '../../shared/env';
import { QueueFetchSpotifyPlays } from '../../shared/queues';
import { FirebaseAuth, UserAttrs } from '../../shared/FirebaseAuth';

// i doth mislike how many separate interests that this handler manages
// suggests mebbe this should be broken out
// what are the concerns we can seperate

export const handler: APIGatewayProxyHandler = async (event) => {
  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    TABLE_TARGET: process.env.TABLE_TARGET,
    QUEUE_TARGET: process.env.QUEUE_TARGET,
    FRONTEND_CUSTOMAUTH_URI: process.env.FRONTEND_CUSTOMAUTH_URI,
  })
  const spotify = SpotifyApi() // we should really be passing spotify creds here imo

  // the use code from spotify grant to get acccess and refresh tokens from api
  const code = event.queryStringParameters['code']
  const { body: { access_token, refresh_token }} = await spotify.authorizationCodeGrant(code)
  spotify.setAccessToken(access_token)
  spotify.setRefreshToken(refresh_token)

  // get the user info from spotify
  const { body: me } = await spotify.getMe()

  // get or create a user based on the result of that
  const auth = await FirebaseAuth()
  const userAttrs: UserAttrs = {
    displayName: me.display_name,
    email: me.email,
    // photoUrl: me.images.length > 0 && me.images[0].url || 'no image',
    spotifyId: me.id,
  }
  if (me.images.length > 0) { userAttrs.photoUrl = me.images[0].url }
  const user = await auth.getOrCreate(userAttrs)

  // update the user's credentials in the table for future use by harvest &c
  const table = TableUser(env.DYNAMO_ENDPOINT, env.TABLE_TARGET)
  const creds = {
    uid: user.uid,
    accessToken: access_token,
    refreshToken: refresh_token,
    spotifyId: me.id,
  }
  // console.log(`inserting new creds to ${env.DYNAMO_ENDPOINT}${env.TABLE_TARGET}: ${JSON.stringify(creds, null, 2)}`)
  await table.setSpotifyCreds(creds)

  // and trigger an immediate poll of their recentlyPlayed
  // maybe this should be a ddb stream handler on update?
  await QueueFetchSpotifyPlays.publish(env.QUEUE_TARGET, {
    uid: user.uid,
    accessToken: access_token,
    refreshToken: refresh_token,
  })

  // generate a customToken that we can give back to the front end
  // which it uses to authenticate the firebase user on the client
  const customToken = await auth.createCustomToken(user.uid)
  return {
    statusCode: 302,
    headers: {
      Location: `${env.FRONTEND_CUSTOMAUTH_URI}?customAccessToken=${customToken}`,      
    },
    body: ""
  }
}