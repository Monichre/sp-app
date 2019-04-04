import React, { useContext, useState, useEffect } from 'react';
import * as firebase from 'firebase';
import { Observable } from 'apollo-link';
import { FirebaseUser } from '../types';
import { Subject } from 'rxjs'

export const FirebaseContext = React.createContext<firebase.app.App | null>(null)

export const useFirebase = () => {
  const firebase = useContext(FirebaseContext)
  if (!firebase) { throw new Error('no firebase! provider value not set?')}
  return firebase
}

export const useFirebaseAuth = () => useFirebase().auth()

export type BasicUser = Pick<firebase.User, 'uid' | 'email' | 'displayName' | 'photoURL'>

type useUserState = {
  isLoading: boolean,
  user: BasicUser | null,
}

const impersonations = new Subject<useUserState>();

export const impersonate = (uid: string) => {
  impersonations.next({isLoading: false, user: { uid, displayName: `Impersonated ${uid}`, photoURL: '', email: 'impersonated@none'}})
}

export const useUser = () => {
  const auth = useFirebaseAuth()
  const [authState, setState] = useState<useUserState>({ isLoading: true, user: null })

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(authState => {
      console.log('new authState:', authState)
      return setState({ isLoading: false, user: authState })
    })
    const iUnsub = impersonations.subscribe(authState => {
      console.log('impersonating authState', authState)
      return setState(authState)
    })
    return unsub
  }, [auth])

  return authState
}

export const useAuthHandlers = () => {
  const auth = useFirebaseAuth()
  return { // gotta wrap two of em, might as well provide all at the same place
    signInWithGoogle: () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()),
    signInWithFacebook: () => auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()),
    signOut: auth.signOut.bind(auth),
    createUserWithEmailAndPassword: auth.createUserWithEmailAndPassword.bind(auth),
    signInWithEmailAndPassword: auth.signInWithEmailAndPassword.bind(auth),
  }
}

export const useUserChange = (fn: (user: firebase.User | null) => any) => {
  const auth = useFirebaseAuth()
  useEffect(() => {
    return auth.onAuthStateChanged(fn)
  }, [auth])
}
