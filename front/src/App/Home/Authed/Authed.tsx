import React, { useContext, useReducer, useState, Reducer, SetStateAction} from 'react';
import styled from 'styled-components'
import { Route, Switch, Redirect } from 'react-router';
import { Loading } from '../../../shared/Loading';
import { useGetUserInfo, ArtistFragmentFragment } from '../../../types';
import { ErrorFallback } from '../ErrorBoundary';
import { Insights } from './Insights/Insights';
import { largeQuery, notLargeQuery } from '../../../shared/media';
import { NavMenu, NavMenuView } from './NavMenu';
import { Profile } from './Profile/Profile';
import { History } from './History/History';
import { IntercomHandler } from '../../../lib/intercom'
import { Comment } from './Insights/shared/Comment';
import { BreadCrumbs } from '../../Components/BreadCrumbs';
import { FirstPlaceBadge, SecondPlaceBadge, ThirdPlaceBadge } from '../../Components/Badge'
import { Action } from 'history';

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

export type AchievementData = {
  achievement: 'Top Listener' | 'Second Top Listener' | 'Third Top Listener'
  artists: ArtistFragmentFragment[]
  Badge: any
}

export type AchievementsState = {
  1: AchievementData
  2: AchievementData
  3: AchievementData
}

/**
 *
 * cc:signin#2;User is Authenticated
 *
 */


const initialAchievements: AchievementsState = {
  1: {
    achievement: 'Top Listener',
    artists: [],
    Badge: <FirstPlaceBadge />
  },
  2: {
    achievement: 'Second Top Listener',
    artists: [],
    Badge: <SecondPlaceBadge />
  },
  3: {
    achievement: 'Third Top Listener',
    artists: [],
    Badge: <ThirdPlaceBadge />
  }
}


const reducer: Reducer<any, Action> = (state: AchievementsState, payload: any) => {
  const { action, data } = payload
  console.log('TCL: data', data)
  console.log('TCL: action', action)
  
  switch (action) {
    
    case 'updateAchievments':
      return { ...data }

    default:
      throw new Error("what's going on?")
  }
}


export const Authed: React.SFC<{ user: { uid: string } }> = ({ user: firebaseUser }) => {

  const result = useGetUserInfo({ variables: { uid: firebaseUser.uid }, pollInterval: 4000, suspend: true})
  const user = result.data && result.data.getUserInfo

  if (!user) { return <ErrorFallback /> }

  const { initialHarvestComplete, lastUpdate, uid } = user
  //@ts-ignore
  const intercomUser: any = JSON.parse(localStorage.getItem('intercomUser'))

  const [userAchievements, setUserAchievements]: any = useReducer(reducer, initialAchievements)  
  console.log('TCL: userAchievements', userAchievements)
 
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

        <NavMenu {...{ initialHarvestComplete: initialHarvestComplete || false, lastUpdate: lastUpdate || '', userAchievements }} />
      
      <React.Suspense fallback={<Loading/>}>
        <Switch>
            <Route path='/insights/:timeScope/:groupId/:perspective' render={(props) => <Insights user={user} {...props} uid={uid}{ ...{setUserAchievements}}  />}/>
          <Route path='/history' render={(props) => <History user={user} {...props} uid={uid}/>}/>
          <Route path='/profile' render={(props) => <Profile user={user} {...props}/>}/>
          <Redirect from='/' to='/insights/thisWeek/global/personal'/>
        </Switch>
      </React.Suspense>
    </AuthedView>
  )
}


