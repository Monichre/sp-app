import React, { useContext, useState, useEffect } from 'react';
import * as firebase from 'firebase';
import { Subject } from 'rxjs'
import LogRocket from 'logrocket'
// import { useGetUserInfo } from '../types';
// import { _getActiveUserRootRef, _getActiveUsersStateRef} from './ActiveUsers'
// should be AuthContext and return uid or nothing

export const FirebaseContext = React.createContext<firebase.app.App | null>(null)

const useFirebase = () => {
  const firebase = useContext(FirebaseContext)
  
  if (!firebase) { throw new Error('no firebase! provider value not set?')}
  return firebase
}

export const useFirebaseAuth = () => useFirebase().auth()
export const useFirebaseAuthDatabase = () => firebase.database()
// export const firebaseActiveUsers = useFirebaseAuthDatabase().ref("USERS_ONLINE")
const impersonations = new Subject<useUserState>();

export const impersonate = (uid: string) => {
  impersonations.next({isLoading: false, user: { uid, displayName: `Impersonated ${uid}`, photoURL: '', email: 'impersonated@none'}})
}


export type BasicUser = Pick<firebase.User, 'uid' | 'email' | 'displayName' | 'photoURL'>

type useUserState = {
  isLoading: boolean,
  user: BasicUser | null,
}

export const useUser = () => {
  const auth = useFirebaseAuth()
  // const activeUsersListRef = firebase.database().ref('USERS_ONLINE')
  // const connectedRef = firebase.database().ref('.info/connected')

  // activeUsersListRef.on("child_added", (snap: any) => {
  // console.log('TCL: useUser -> snap, new user added', snap.val())
  //   // const presence: PresenceIF = snap.val();
    
  //   // ctx.emit(GLOBAL_CONSTANTS.LE_PRESENCE_USER_ADDED, presence);
  // });

  // // update the UI to show that a user has left (gone offline)
  // activeUsersListRef.on("child_removed", (snap: any) => {
  //   // const presence: PresenceIF = snap.val();
  //   console.log('TCL: useUser -> snap', snap)
  //   // ctx.emit(GLOBAL_CONSTANTS.LE_PRESENCE_USER_REMOVED, presence);
  // });

  // // update the UI to show that a user's status has changed
  // activeUsersListRef.on("child_changed", (snap: any) => {
  //   // const presence: PresenceIF = snap.val();
  //   console.log('TCL: useUser -> snap', snap)
  //   // ctx.emit(GLOBAL_CONSTANTS.LE_PRESENCE_USER_CHANGED, presence);
  // });

  const [authState, setState] = useState<useUserState>({ isLoading: true, user: null })

  useEffect(() => {
    
    const unsub = auth.onAuthStateChanged(authState => {
      console.log('new authState:', authState)
      if (authState) {
        LogRocket.identify(authState.uid, {
          name: authState.displayName || 'N/A',
          email: authState.email || 'N/A',
        })

        // const currentUserRef = activeUsersListRef.push()
        // console.log('TCL: useUser -> currentUserRef', currentUserRef)

        // // Monitor connection state on browser tab
        // connectedRef.on('value', (snap: any) => {
        //   if (snap.val()) {
        //     console.log('TCL: initPresence -> snap.val()', snap.val())
        //     currentUserRef.set({
        //       user: {
        //         name: authState.displayName || 'N/A',
        //         email: authState.email || 'N/A'
        //       }, status: 'online'
        //     })
        //     // const result = useGetUserInfo({ variables: { uid: authState.uid }, pollInterval: 4000, suspend: true })
        //     // console.log('TCL: useUser -> result', result)
        //     // const user = result.data && result.data.getUserInfo
        //     // console.log('TCL: useUser -> user', user)
        //     // If we lose our internet connection, we want ourselves removed from the list.
            
        //     // Set our initial online status.
        //     // setUserStatus(PRESENCE_STATES.ONLINE, ctx)
        //   } else {
        //     // We need to catch anytime we are marked as offline and then set the correct
        //     // status. We could be marked as offline 1) on page load or 2) when we lose our
        //     // internet connection temporarily.
        //     // setUserStatus(PRESENCE_STATES.OFFLINE, ctx)
        //   }
        // })


      }

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
  console.log('TCL: useUserChange -> auth', auth)
  useEffect(() => {
    return auth.onAuthStateChanged(fn)
  }, [auth])
}
