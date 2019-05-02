import { APIGatewayProxyHandler } from 'aws-lambda';

import { SpotifyApi } from '../../shared/SpotifyApi'
import { TableUser } from '../../shared/tables/TableUser';
import { verifyEnv } from '../../shared/env';
import { QueueFetchSpotifyPlays, QueueValidationErrors } from '../../shared/queues';
import { FirebaseAuth, UserAttrs } from '../../shared/FirebaseAuth';
import { makeLogger, TLogger } from '../logger';
import * as winston  from 'winston';

// i doth mislike how many separate interests that this handler manages
// suggests mebbe this should be broken out
// what are the concerns we can seperate

// const log = slog.child({handler: 'spotify/callback', awsEvent: 'http'})

export const handleError = async (log: TLogger, QueueUrl: string, error: Error, context: any = {}, uid = 'n/a') => {
  // const paths = errorPaths(errors)
  log.error('user sign in failed', {error, context, uid})
  const paths = [JSON.stringify(error, null, 2)]
  await QueueValidationErrors.publish(QueueUrl, {
    uid,
    paths,
    context
  })
  log.info('error reported to', { QueueUrl, uid, paths, context })
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const log = makeLogger({handler: 'spotify/callback', awsEvent: 'http'})
  let uid = 'n/a'
  let context = { event }

  const env = verifyEnv({
    DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
    TABLE_TARGET: process.env.TABLE_TARGET,
    QUEUE_TARGET: process.env.QUEUE_TARGET,
    FRONTEND_CUSTOMAUTH_URI: process.env.FRONTEND_CUSTOMAUTH_URI,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
    QUEUE_VALIDATION_ERRORS: process.env.QUEUE_VALIDATION_ERRORS,
  })
  try {
    const spotify = SpotifyApi(env) // we should really be passing spotify creds here imo
  
    const utcOffset = parseInt(event.queryStringParameters['state'])
    log.info('qs params', { utcOffset })
    context['utcOffset'] = utcOffset
  
    // the use code from spotify grant to get acccess and refresh tokens from api
    const code = event.queryStringParameters['code']
    const { body: { access_token, refresh_token }} = await spotify.authorizationCodeGrant(code)
    spotify.setAccessToken(access_token)
    spotify.setRefreshToken(refresh_token)
    context['tokens'] = { access_token, refresh_token }
  
    // get the user info from spotify
    const { body: me } = await spotify.getMe()
    uid = `spotify:${me.id}`

    // get or create a user based on the result of that
    const auth = await FirebaseAuth()
    const userAttrs: UserAttrs = {
      displayName: me.display_name,
      email: me.email,
      // photoUrl: me.images.length > 0 && me.images[0].url || 'no image',
      spotifyId: me.id,
    }
    context['userAttrs'] = userAttrs
    if (me.images.length > 0) { userAttrs.photoUrl = me.images[0].url }
    const fbUser = await auth.getOrCreate(userAttrs)
    context['fbUser'] = fbUser
  
    // update the user's credentials in the table for future use by harvest &c
    const table = TableUser(env.DYNAMO_ENDPOINT, env.TABLE_TARGET)
    const user = {
      uid: fbUser.uid,
      email: fbUser.email,
      accessToken: access_token,
      refreshToken: refresh_token,
      spotifyId: me.id,
      utcOffset,
      displayName: fbUser.displayName,
      photoURL: fbUser.photoURL
    }
    context['updateUser'] = user
    // console.log(`inserting new creds to ${env.DYNAMO_ENDPOINT}${env.TABLE_TARGET}: ${JSON.stringify(creds, null, 2)}`)
    await table.updateUser(user)
  
    // and trigger an immediate poll of their recentlyPlayed
    // maybe this should be a ddb stream handler on update?
    await QueueFetchSpotifyPlays.publish(env.QUEUE_TARGET, {
      uid: fbUser.uid,
      accessToken: access_token,
      refreshToken: refresh_token,
      utcOffset,
    })
  
    // generate a customToken that we can give back to the front end
    // which it uses to authenticate the firebase user on the client
    const customToken = await auth.createCustomToken(fbUser.uid)
    return {
      statusCode: 302,
      headers: {
        Location: `${env.FRONTEND_CUSTOMAUTH_URI}?customAccessToken=${customToken}`,      
      },
      body: ""
    }
  } catch (error) {
    await handleError(log, env.QUEUE_VALIDATION_ERRORS, error, context, uid)
    return {
      statusCode: 500,
      body: "We're sorry, something went wrong with your sign-in.  We've been notified and are investigating right now!"
    }
  }

}