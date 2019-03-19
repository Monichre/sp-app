import React from 'react';
import { Route, RouteComponentProps } from 'react-router';
import { SignIn } from './SignIn';
import { Join } from './Join';
import { Link } from 'react-router-dom';
import { useUserChange } from '../../comp/FirebaseContext';
import { useOnLogin, FirebaseUser } from '../../types';
import * as firebase from 'firebase';
import * as R from 'ramda'

const firebaseUserFieldsNeeded = [
  'uid', 'displayName', 'photoURL', 'email', 'emailVerified', 'phoneNumber', 'isAnonymous', 'providerData'
]

const pickVars: (u: firebase.User) => FirebaseUser = R.pick(firebaseUserFieldsNeeded)

export const Auth: React.SFC<RouteComponentProps> = ({match}) => {
  const onLogin = useOnLogin()
  useUserChange(async user => {
    if (user) {
      await onLogin({variables: { user: pickVars(user)}})
      window.location.replace('/dash')
    }
  })

  return (
  <>
    <Route path={`${match.path}/signin`} component={SignIn}/>
    <Route path={`${match.path}/join`} component={Join}/>
    <Link to='/'>Cancel</Link>
  </>
  )
}
