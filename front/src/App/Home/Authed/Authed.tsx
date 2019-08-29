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
import { Drawer, List, Avatar, Divider, Col, Row } from 'antd';
import 'antd/es/drawer/style/css'
import { UserAchievementPeriodMap } from '../../Components/UserAchievementsList/achievements-utils';
import { Card, Box } from 'rebass';
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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: ;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: "Top" "Bottom";
`

const Top = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "SideBarTop .";
  grid-area: Top;
  `
const Bottom = styled.div`
display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "SideBarBottom .";
  grid-area: Bottom;
  `

const SideBarTop = styled.div`grid-area: SideBarTop;`

const SideBarBottom = styled.div`grid-area: SideBarBottom;`

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
    height: 100vh;
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

type UserAchievementContextProps = {
  achievements: {}
  setAchievements: (a: UserAchievementPeriodMap) => void
  isOpen: Boolean
  setSideBarOpen: (o: Boolean) => Boolean
}

const initialState: any = {
  currentUser: {},
  achievements: { week: null, month: null, life: null },
  topArtistsWithAchievementHolders: null,
  isOpen: false

}

export const UserAchievementContext = createContext({
  ...initialState.currentUser,
  ...initialState.achievements,
  setAchievements: () => initialState.achievements,
  ...initialState.achievements.isOpen,
  setSideBarOpen: () => initialState.achievements.isOpen,
  ...initialState.topArtistsWithAchievementHolders,
  setTopArtistsWithAchievementHolders: () => initialState.topArtistsWithAchievementHolders
})




const UserAchievementDataProvider = ({ user, children, isOpen, setSideBarOpen }: any) => {
  
  const [achievements, setParentAchievements]: [UserAchievementPeriodMap, any] = useState(initialState.achievements)
  const [topArtistsWithAchievementHolders, setParentComponentWithArtistsWithAchievementHolders]: [UserAchievementPeriodMap, any] = useState(initialState.topArtistsWithAchievementHolders)
  const [currentUser, setCurrentUser] = useState(user)


  const setAchievements: any = (newAchievements: any) => setParentAchievements(newAchievements)
  const setTopArtistsWithAchievementHolders: any = (newArtistsWithAchievements: any) => setParentComponentWithArtistsWithAchievementHolders((topArtistsWithAchievementHolders: any) => {
    if (topArtistsWithAchievementHolders) {
      return [topArtistsWithAchievementHolders, ...newArtistsWithAchievements]
    }
  })

  return (
    <UserAchievementContext.Provider value={{ achievements, setAchievements, currentUser, setSideBarOpen, isOpen, setTopArtistsWithAchievementHolders,  topArtistsWithAchievementHolders}}>
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



