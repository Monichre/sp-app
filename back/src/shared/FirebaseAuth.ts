import * as firebase from 'firebase-admin'
import { verifyEnv } from './env';

const uidFromSpotifyId = spotifyId => `spotify:${spotifyId}`

export type UserAttrs = {
  displayName: string,
  email: string,
  photoUrl?: string,
  spotifyId: string,
}

export const FirebaseAuth = () => {
  if (firebase.apps.length > 0) {
    // in offline, the firebase app stays open and changes to env dont propagate
    // if youre testing this fn, you may need:
    // await firebase.apps[0].delete()
    // dont deploy that anywhere meaningful!
  } else {
    const env = verifyEnv({
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    })
    const serviceAccount = {
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }
    firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount)
    })
  }
  const _auth = firebase.auth()

  const createCustomToken = _auth.createCustomToken.bind(_auth)

  // get an existing user by email or create a new user
  // note: this will get more challenging
  // when we have multiple auth sources beyond just spotify
  // eg email, facebook, etc
  // firebase auth users have to have a unique email
  // but you can link multiple auth providers to a single user
  const getOrCreate = async (attrs: UserAttrs) => {
    try {
      const existing = await _auth.getUserByEmail(attrs.email) // or throw and catch
      await _auth.updateUser(existing.uid, attrs)
      return existing
    } catch (err) {
      console.log('user does not exist, creating', err) // this should just be 'user exists' error
      const user = await _auth.createUser({
        uid: uidFromSpotifyId(attrs.spotifyId),
        ...attrs
      })
      return user
    }
  }

  return {
    createCustomToken,
    getOrCreate,
  }
}