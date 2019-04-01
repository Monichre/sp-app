import { APIGatewayProxyHandler } from 'aws-lambda';
import * as firebase from 'firebase-admin'

import { api } from './api'

const uidFromSpotifyId = spotifyId => `spotify:${spotifyId}`

// this will end up in our own typings for spotify api validation interface
type SpotifyMeResult = {
  display_name: string
  email: string
  id: string
  images: {url: string}[]
}

// this firebase-related logic will likely end up being shared
const firebaseAuth = async () => {
  if (firebase.apps.length > 0) {
    // in offline, the firebase app stays open and changes to env dont propagate
    // if youre testing this fn, you may need:
    // await firebase.apps[0].delete()
    // dont deploy that anywhere meaningful!
    return firebase.apps[0].auth()
  }
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
  })
  return firebase.auth()
}

const userUpdateRequestFromSpotify = ({display_name: displayName, email, images}: SpotifyMeResult) => {
  const result: firebase.auth.UpdateRequest = { displayName, email }
  if (images && images[0] && images[0].url) { result.photoURL = images[0].url }
  return result
}

const userCreateRequestFromSpotify = (me: SpotifyMeResult) => ({
  uid: uidFromSpotifyId(me.id),
  ...userUpdateRequestFromSpotify(me)
})

// this is actually fairly specific to this handler
// might be re-used if we do a script that imports old accounts
// actually there is a more generic getOrCreateUser that would just take an email and the request args
const getOrCreateUserFromSpotify = async (auth: firebase.auth.Auth, me: SpotifyMeResult) => {
  try {
    const existing = await auth.getUserByEmail(me.email) // or throw and catch
    const req = userUpdateRequestFromSpotify(me)
    await auth.updateUser(existing.uid, req)
    return existing
  } catch (err) {
    console.log('caught err', err) // this should just be 'user exists' error
    const req = userCreateRequestFromSpotify(me)
    const user = await auth.createUser(req)
    return user
  }
}

export const handler: APIGatewayProxyHandler = async (event) => {
  // set up spotify api client
  const spotify = api()

  // the use code from spotify grant to get acccess and refresh tokens from api
  const code = event.queryStringParameters['code']
  const result = await spotify.authorizationCodeGrant(code)
  const { body: { access_token, refresh_token }} = result
  spotify.setAccessToken(access_token)
  spotify.setRefreshToken(refresh_token)
  // somwhere here is where we would save these external credentials for the user
  // for future use by harvester

  // get the user info from spotify
  const { body: me } = await spotify.getMe()

  // connect to firebase auth
  const auth = await firebaseAuth()
  // get an existing user by email or create a new user
  // note: this will get more challenging
  // when we have multiple auth sources beyond just spotify
  // eg email, facebook, etc
  // firebase auth users have to have a unique email
  // but you can link multiple auth providers to a single user
  const user = await getOrCreateUserFromSpotify(auth, me)

  // generate a customToken that we can give back to the front end
  // which it uses to authenticate the firebase user on the client
  const customToken = await auth.createCustomToken(user.uid)
  return {
    statusCode: 302,
    headers: {
      Location: `${process.env.FRONTEND_CUSTOMAUTH_URI}?customAccessToken=${customToken}`,      
    },
    body: ""
  }
}