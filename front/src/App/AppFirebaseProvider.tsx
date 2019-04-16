import React from "react"
import { FirebaseContext } from "./FirebaseContext"
import * as firebase from "firebase"

const fbApp = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
})

// react suspense isnt ready for async data loading in 16.8.x...
// but somehow react-apollo-hooks supports it

export const AppFirebaseProvider: React.SFC = ({children}) => (
  <FirebaseContext.Provider value={fbApp}>
    {children}
  </FirebaseContext.Provider>
)
