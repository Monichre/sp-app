import React from 'react';
import styled from 'styled-components'
import { Route, Switch, Redirect } from 'react-router';
import { Loading } from '../../../shared/Loading';
import { useGetUserInfo } from '../../../types';
import { ErrorFallback } from '../ErrorBoundary';
import { OnboardingMessage } from './AuthedOnboardingMessage'
import { Insights } from './Insights/Insights';
import { largeQuery, notLargeQuery } from '../../../shared/media';
import { DummyRouted } from '../../../shared/debug/DummyRouted';
import { NavMenu, NavMenuView } from './NavMenu';
import { Profile } from './Profile/Profile';
import { History } from './History/History';

const SIDEBAR_WIDTH = 200

const AuthedView = styled.div`
  height: 100%;
  width: 100%;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  ${largeQuery`
    padding-left: ${SIDEBAR_WIDTH}px;
  `}
  ${NavMenuView} {
    position: fixed;
    display: flex;
    ${largeQuery`
      flex-direction: column;
      left: 0;
      top: 0;
      height: 100%;
      width: ${SIDEBAR_WIDTH}px;
    `}
    ${notLargeQuery`
      display: flex;
      flex-direction: row;
      justify-content: center;
      position: fixed;
      left: 0;
      right: 0;
      width: 100%;
      bottom: 0;
    `}
  }
`

//cc:signin#2;User is Authenticated
export const Authed: React.SFC<{user: {uid: string}}> = ({user: firebaseUser}) => {
  const result = useGetUserInfo({ variables: { uid: firebaseUser.uid }, pollInterval: 4000, suspend: true})
  const user = result.data && result.data.getUserInfo
  if (!user) { return <ErrorFallback/> }
  const { initialHarvestComplete, lastUpdate, uid } = user
  //@ts-ignore
  const intercomUser: any = JSON.parse(localStorage.getItem('intercomUser'))
  console.log('userInfo', user)

//@ts-ignore
  window.Intercom('boot', {
    name: user.displayName || 'N/A', // Full name
    email: user.email || 'N/A', // Email address
    user_id: user.uid,
    avatar: {
      "type": "avatar",
      "image_url": user.photoURL
    }, // current_user_id
    initialHarvestComplete,
    lastUpdate

  })

  if (intercomUser && intercomUser === user.displayName) {

  } else {
    //@ts-ignore
    window.Intercom('trackEvent', 'user-login', {
      name: user.displayName || 'N/A', // Full name
      email: user.email || 'N/A', // Email address
      user_id: user.uid,
      avatar: {
        "type": "avatar",
        "image_url": user.photoURL
      }, // current_user_id
      initialHarvestComplete,
      lastUpdate
    })
    localStorage.setItem('intercomUser', JSON.stringify(user.displayName))
  }
  
 
  // if (!user.initialHarvestComplete) { return <OnboardingMessage/> }
  return (
    <AuthedView>
        <NavMenu {...{initialHarvestComplete: initialHarvestComplete || false, lastUpdate: lastUpdate || ''}}/>
      <React.Suspense fallback={<Loading/>}>
        <Switch>
          <Route path='/insights/:timeScope/:groupId/:perspective' render={(props) => <Insights user={user} {...props} uid={uid}/>}/>
          <Route path='/history' render={(props) => <History user={user} {...props} uid={uid}/>}/>
          <Route path='/profile' render={(props) => <Profile user={user} {...props}/>}/>
          <Redirect from='/' to='/insights/thisWeek/global/personal'/>
        </Switch>
      </React.Suspense>
    </AuthedView>
  )
}


