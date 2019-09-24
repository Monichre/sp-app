import React, { useContext, createContext, useReducer, useState, Reducer, SetStateAction, useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components'
import { Route, Switch, Redirect } from 'react-router';
import { Loading } from '../../../shared/Loading';
import { useGetUserInfo, ArtistFragmentFragment, ArtistsFragmentArtist } from '../../../types';
import { ErrorFallback } from '../ErrorBoundary';
import { Insights } from './Insights/Insights';
import { largeQuery, notLargeQuery } from '../../../shared/media';
import { NavMenu, NavMenuView } from './NavMenu';
import { Profile } from './Profile/Profile';
import { History } from './History/History';
import { IntercomHandler } from '../../../lib/intercom'
import 'antd/es/drawer/style/css'
import { UserAchievementPeriodMap } from '../../Components/UserAchievementsList/achievements-utils';
import { SideBar } from '../../Components/SideBar/SideBar';


const DescriptionItem = ({ title, content }: any) => (
  <div
    style={{
      fontSize: 14,
      lineHeight: '22px',
      marginBottom: 7,
      color: 'rgba(0,0,0,0.65)',
    }}
  >
    <p
      style={{
        marginRight: 8,
        display: 'inline-block',
        color: 'rgba(0,0,0,0.85)',
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);


const SIDEBAR_WIDTH = 200


const AuthedView = styled.div`
  height: 100%;
  width: 100%;
  background-color: #030616;
  position: relative;

  ${largeQuery`
    padding-left: ${SIDEBAR_WIDTH}px;
  `}
  ${NavMenuView} {
    position: fixed;
    
    display: flex;
    ${largeQuery`
      flex-direction: column;
      left: 0;
      height: 100vh;
      top: 0;
      width: ${SIDEBAR_WIDTH}px;
      border-right: 1px solid rgba(255, 255, 255, .1);
    `}
    
    ${notLargeQuery`
      display: flex;
      flex-direction: row;
      justify-content: center;
      background-color: #030616;
      position: fixed;
      height: 15vh;
      left: 0;
      right: 0;
      width: 100%;
      bottom: 0;

      @media screen and (max-width: 600px) {
        height: 10vh;

        svg {
          margin-bottom: 0;
          height: 20px;
          width: 20px;
        }
      }
      .sc-iELTvK {
       padding: 0;
       justify-content: center;
       display: flex;
       align-content: center;

       align-items: center;

      }
      .sc-feJyhm.escZRd {
        display: none;
      } 
      .sc-hzDkRC.ldGACO {
        margin: auto;
        display: block;
        position: relative;
      }
    `}
  }
`

export type OverviewAchievementDataItem = {
  total: number
  artist: ArtistsFragmentArtist
}

export type OverviewAchievementData = {
  achievement: 'Top Listener' | 'Second Top Listener' | 'Third Top Listener'
  earned: boolean
  data: AchievementDataItem[]
  Badge?: any
}

export type OverviewAchievementsState = {
  1: OverviewAchievementData
  2: OverviewAchievementData
  3: OverviewAchievementData
}

export type AchievementDataItem = {
  total: number
  artist: ArtistsFragmentArtist
}

export type AchievementData = {
  artist: ArtistsFragmentArtist
  fk: string
  pk: string
  sk: string
  total: number
  user: any
  Badge?: any
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



const initialState: any = {
  currentUser: {},
  achievements: { week: null, month: null, life: null },
  topArtistsWithAchievementHolders: [],
  notifications: [],
  isOpen: false

}

export const UserAchievementContext = createContext({
  ...initialState.currentUser,
  ...initialState.achievements,
  setAchievements: () => initialState.achievements,
  ...initialState.achievements.isOpen,
  setSideBarOpen: () => initialState.achievements.isOpen,
  ...initialState.topArtistsWithAchievementHolders,
  setTopArtistsWithAchievementHolders: () => initialState.topArtistsWithAchievementHolders,
  ...initialState.notifications,
  setNotifications: () => []

})




const UserAchievementDataProvider = ({ user, children, isOpen, setSideBarOpen }: any) => {
  
  const [achievements, setAppAchievements]: [UserAchievementPeriodMap, any] = useState(initialState.achievements)
  const [topArtistsWithAchievementHolders, setAppComponentWithArtistsWithAchievementHolders]: [UserAchievementPeriodMap, any] = useState(initialState.topArtistsWithAchievementHolders)
  const [currentUser, setCurrentUser] = useState(user)

  const [appNotifications, setAppNotifications] = useState(null)

  const setNotifications = (newNotifications: any) => {
    setAppNotifications(appNotifications => newNotifications)
  }

  const setAchievements: any = (newAchievements: any) => {
    localStorage.setItem('userAchievements', JSON.stringify(newAchievements))

    setAppAchievements(newAchievements)
  }

  
  const setTopArtistsWithAchievementHolders: any = (newArtistsWithAchievements: any) => setAppComponentWithArtistsWithAchievementHolders((topArtistsWithAchievementHolders: any) => (topArtistsWithAchievementHolders && topArtistsWithAchievementHolders.length && newArtistsWithAchievements && newArtistsWithAchievements.length ? [...topArtistsWithAchievementHolders, ...newArtistsWithAchievements] : newArtistsWithAchievements && newArtistsWithAchievements.length ? [...newArtistsWithAchievements] : []))

  return (
    <UserAchievementContext.Provider value={{ achievements, setAchievements, currentUser, setSideBarOpen, isOpen, setTopArtistsWithAchievementHolders,  topArtistsWithAchievementHolders, appNotifications, setNotifications}}>
      {children}
    </UserAchievementContext.Provider>
  )

}


export const Authed: React.SFC<{ user: { uid: string } }> = ({ user: firebaseUser, ...rest }) => {

  const result = useGetUserInfo({ variables: { uid: firebaseUser.uid }, pollInterval: 4000, suspend: true })
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


  const [isOpen, openSideBar] = useState(false)
  const setSideBarOpen: any = () => openSideBar(isOpen => !isOpen)

  
  return (
    <>
      <AuthedView>

        <UserAchievementDataProvider {...{ setSideBarOpen, user, isOpen }}>
          <NavMenu {...{ initialHarvestComplete: initialHarvestComplete || false, lastUpdate: lastUpdate || '', user: user, ...rest }} />
          <SideBar />
          <React.Suspense fallback={<Loading />}>
            <Switch>
              <Route path='/insights/:timeScope/:groupId/:perspective' render={(props) => <Insights user={user} {...props} uid={uid} />} />
              <Route path='/history' render={(props) => <History user={user} {...props} uid={uid} />} />
              <Route path='/profile' render={(props) => <Profile user={user} {...props} />} />
              <Redirect from='/' to='/insights/thisWeek/global/personal' />
            </Switch>
          </React.Suspense>
        </UserAchievementDataProvider>
      </AuthedView>
 
    </>
  )
}



