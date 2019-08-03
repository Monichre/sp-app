import React, { useContext, useState} from 'react';
import styled from 'styled-components'
import { Route, Switch, Redirect } from 'react-router';
import { Loading } from '../../../shared/Loading';
import { useGetUserInfo } from '../../../types';
import { ErrorFallback } from '../ErrorBoundary';
import { Insights } from './Insights/Insights';
import { largeQuery, notLargeQuery } from '../../../shared/media';
import { NavMenu, NavMenuView } from './NavMenu';
import { Profile } from './Profile/Profile';
import { History } from './History/History';
import { IntercomHandler } from '../../../lib/intercom'
import * as firebase from 'firebase';
import { Comment } from './Insights/shared/Comment';
import { BreadCrumbs } from '../../Components/BreadCrumbs';

const SIDEBAR_WIDTH = 200

const AuthedView = styled.div`
  height: 100%;
  width: 100%;
background-color: #030616;
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
      border-right: 1px solid rgba(255, 255, 255, .1);
    `}
    ${notLargeQuery`
      display: flex;
      flex-direction: row;
      justify-content: center;
      background-color: #030616;
      position: fixed;
      left: 0;
      right: 0;
      width: 100%;
      bottom: 0;
    `}
  }
`

const achievements: any = {
  1: {
    achievement: 'Top Listener',
    artists: []
  },
  2: {
    achievement: 'Second Top Listener',
    artists: []
  },
  3: {
    achievement: 'Third Top Listener',
    artists: []
  }
}

/**
 *
 * cc:signin#2;User is Authenticated
 *
 */


const UserAchievementsContext: any = React.createContext(achievements)
export const Authed: React.SFC<{ user: { uid: string } }> = ({ user: firebaseUser }) => {
  
  const [userAchievements, setUserAchievements]: any = useState(achievements)
  const result = useGetUserInfo({ variables: { uid: firebaseUser.uid }, pollInterval: 4000, suspend: true})
  const user = result.data && result.data.getUserInfo

  if (!user) { return <ErrorFallback /> }
  
  

  const { initialHarvestComplete, lastUpdate, uid } = user
  //@ts-ignore
  const intercomUser: any = JSON.parse(localStorage.getItem('intercomUser'))
  

  if (process.env.NODE_ENV === 'production') {
    IntercomHandler.boot(user, 'boot')
  }
  
  if (!intercomUser && intercomUser !== user.displayName) {
    if (process.env.NODE_ENV === 'production') {
      IntercomHandler.trackEvent(user, 'user-login')
      localStorage.setItem('intercomUser', JSON.stringify(user.displayName))
    }
  }
  

/**
*
* cc: userAchievementsFrontEnd#2;Passing down the state setting function
*
*/
  return (
    <AuthedView>
      <UserAchievementsContext.Provider value={[userAchievements, setUserAchievements]}>
        <NavMenu {...{ initialHarvestComplete: initialHarvestComplete || false, lastUpdate: lastUpdate || '' }}/>
      <React.Suspense fallback={<Loading/>}>
        <Switch>
            <Route path='/insights/:timeScope/:groupId/:perspective' render={(props) => <Insights user={user} {...props} uid={uid}{ ...{userAchievements, setUserAchievements}}  />}/>
          <Route path='/history' render={(props) => <History user={user} {...props} uid={uid}/>}/>
          <Route path='/profile' render={(props) => <Profile user={user} {...props}/>}/>
          <Redirect from='/' to='/insights/thisWeek/global/personal'/>
        </Switch>
      </React.Suspense>
      </UserAchievementsContext.Provider>
    </AuthedView>
  )
}


