import React from 'react';
import { LayoutAppBar } from '../LayoutAppBar';
import { useUserChange, useUser } from '../../comp/FirebaseContext';
import { RecentPlays } from './RecentPlays';
import { PlaytimeSummary } from './PlaytimeSummary';
import { Route, Switch, Redirect } from 'react-router';
import { DashStats } from './DashStats';
import { Loading } from '../../comp/Loading';

// we are passing uid={user.uid} to the child components
// when we would rather be just doing useUser() with a hook inside them (i think?)
// but i dont want to deal with that until our useUser hook is suspenseful
// otherwise we have to put this isLoading bullshit all over the place to get type safety
// when we dont really need it
export const Dash: React.SFC = () => {
  useUserChange(user => !user && window.location.replace('/'))
  const { user, isLoading } = useUser()
  if (isLoading) { return <Loading/> }
  if (!user) { return <div>User not found!</div>}
  return (
    <LayoutAppBar>
      <PlaytimeSummary uid={user.uid} displayName={user.displayName}/>
      <React.Suspense fallback={<Loading/>}>
        <Switch>
          <Route path='/history' render={(props) => <RecentPlays {...props} uid={user.uid}/>}/>
          <Route path='/insights/:period' render={(props) => <DashStats {...props} uid={user.uid}/>}/>
          <Redirect from='/' exact to='/insights/week'/>
          <Redirect from='/insights' exact to='/insights/week'/>
        </Switch>
      </React.Suspense>
    </LayoutAppBar>
  )
}

