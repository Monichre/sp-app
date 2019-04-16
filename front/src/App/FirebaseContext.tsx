import React, { useContext, useState, useEffect } from 'react';
import * as firebase from 'firebase';
import { Subject } from 'rxjs'

// should be AuthContext and return uid or nothing

export const FirebaseContext = React.createContext<firebase.app.App | null>(null)

const useFirebase = () => {
  const firebase = useContext(FirebaseContext)
  if (!firebase) { throw new Error('no firebase! provider value not set?')}
  return firebase
}

export const useFirebaseAuth = () => useFirebase().auth()

const impersonations = new Subject<useUserState>();

export const impersonate = (uid: string) => {
  impersonations.next({isLoading: false, user: { uid, displayName: `Impersonated ${uid}`, photoURL: '', email: 'impersonated@none'}})
}

// const promiseUser = (auth: firebase.auth.Auth) =>
//   new Promise<BasicUser | null>((resolve, reject) => {
//     const unsub = auth.onAuthStateChanged(user => {
//       console.log('promise resolving')
//       unsub();
//       resolve(user);
//     }, reject)
//   })

// trying to make a hook that works with suspense
// locking browser rn
// export const useUser2 = () => {
//   const auth = useFirebaseAuth()
//   const [userState, setUser] = useState<BasicUser | null>(null)
//   const [loadedState, setLoaded] = useState<boolean>(false)

//   if (!loadedState) {
//     throw promiseUser(auth).then(user => {setLoaded(true); setUser(user)})
//   }
//   useEffect(() => {
    
//     const unsub = auth.onAuthStateChanged(user => {
//       console.log('new user:', user)
//       return setUser(user)
//     })
//     const iUnsub = impersonations.subscribe(imp => {
//       console.log('impersonating authState', imp)
//       return setUser(imp.user)
//     })
//     return unsub
//   }, [auth])

//   return { user: userState, isLoading: false }
// }

export type BasicUser = Pick<firebase.User, 'uid' | 'email' | 'displayName' | 'photoURL'>

type useUserState = {
  isLoading: boolean,
  user: BasicUser | null,
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
