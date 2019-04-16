import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { Loading } from '../../../shared/Loading';
import { useGetUserInfo, GetUserInfoGetUserInfo } from '../../../types';
import { ErrorFallback } from '../ErrorBoundary';
import { AuthedLayout } from './AuthedLayout';
import { AuthedAppBar } from './AuthedAppBar';
import { OnboardingMessage } from './AuthedOnboardingMessage'
import { Artist } from './Artist/Artist';
import { Dash } from './Dash/Dash';

const AuthedRoutes: React.SFC<{user: GetUserInfoGetUserInfo}> = ({user}) =>
  <Switch>
    <Route path='/dash' render={(props) => <Dash {...props} user={user}/>}/>
    <Route path='/artist/:id' render={(props) => <Artist {...props} user={user}/>}/>
    <Redirect from='/' exact to='/dash'/>
  </Switch>

export const Authed: React.SFC<{user: {uid: string}}> = ({user: firebaseUser}) => {
  const result = useGetUserInfo({ variables: { uid: firebaseUser.uid }, pollInterval: 4000, suspend: true})
  const user = result.data && result.data.getUserInfo
  if (!user) { return <ErrorFallback/> }
  console.log('userInfo', user)
  // if (!user) { throw new Error('No user found!')} // error boundary not handling this properly???

  return (
    <AuthedLayout>
      <AuthedAppBar/>
      <React.Suspense fallback={<Loading/>}>
        {user.initialHarvestComplete ? <AuthedRoutes {...{user}}/> : <OnboardingMessage/> }
      </React.Suspense>
    </AuthedLayout>
  )
}

