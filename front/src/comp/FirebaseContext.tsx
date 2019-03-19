import React, { useContext, useState, useEffect } from 'react';
import * as firebase from 'firebase';

export const FirebaseContext = React.createContext<firebase.app.App | null>(null)

export const useFirebase = () => {
  const firebase = useContext(FirebaseContext)
  if (!firebase) { throw new Error('no firebase! provider value not set?')}
  return firebase
}

export const useFirebaseAuth = () => useFirebase().auth()

type useUserState = {
  isLoading: boolean,
  user: firebase.User | null,
}

export const useUser = () => {
  const auth = useFirebaseAuth()
  const [authState, setState] = useState<useUserState>({ isLoading: true, user: null })

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(authState => {
      console.log('new authState:', authState)
      return setState({ isLoading: false, user: authState })
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
