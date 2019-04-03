import React from 'react';
import styled from 'styled-components'
import { LayoutAppBar } from '../LayoutAppBar';
import { useUserChange, useUser } from '../../comp/FirebaseContext';
import { RecentPlays } from './RecentPlays';
import { PlaytimeSummary } from './PlaytimeSummary';
import { Route, Switch } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import { DashStats } from './DashStats';
import { Loading } from '../../comp/Loading';

const EvenRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  & > * {
    flex: 1
  }
`

const TabLink = styled(NavLink)`
  display: block;
  text-align: center
  padding: 0.5rem;
  margin: 0.5rem;
  font-size: 1.25rem;
  font-weight: bold;
  color: #999 !important;
  background-color: #444 !important;

  &.active {
    color: #FFF !important;
    background-color: #666 !important;
  }
`

const DashNav: React.SFC = () =>
  <EvenRow>
      <TabLink data-test='link-insights' exact to='/'>Insights</TabLink>
      <TabLink data-test='link-history' to='/history'>History</TabLink>
  </EvenRow>

// we are passing uid={user.uid} to the child components
// when we would rather be just doing useUser() with a hook inside them (i think?)
// but i dont want to deal with that until our useUser hook is suspenseful
// otherwise we have to put this isLoading bullshit all over the place to get type safety
// when we dont really need it
export const Dash: React.SFC = () => {
  useUserChange(user => !user && window.location.replace('/'))
  const { user, isLoading } = useUser()
  if (isLoading) { return <div>Loading</div> }
  if (!user) { return <div>User not found!</div>}
  return (
    <LayoutAppBar>
      <h1 style={{textAlign: 'center'}}>
        Welcome to Soundpruf,
        <br/>
        <span data-test="displayName">{user.displayName}</span>
      </h1>
      <PlaytimeSummary uid={user.uid}/>
      <DashNav/>
      <React.Suspense fallback={<Loading/>}>
        <Switch>
          <Route path='/history' render={(props) => <RecentPlays {...props} uid={user.uid}/>}/>
          <Route path='/' render={(props) => <DashStats {...props} uid={user.uid}/>}/>
        </Switch>
      </React.Suspense>
    </LayoutAppBar>
  )
}

