import React from 'react';
import { BasicUser } from '../../../FirebaseContext';
import { History } from './History/History';
import { DashSummary } from './DashSummary/DashSummary';
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router';
import { Insights } from './Insights/Insights';
import { Loading } from '../../../../shared/Loading';
import { DashNav } from './DashNav';

// we are passing uid={user.uid} to the child components
// when we would rather be just doing useUser() with a hook inside them (i think?)
// but i dont want to deal with that until our useUser hook is suspenseful
// otherwise we have to put this isLoading bullshit all over the place to get type safety
// when we dont really need it
export const Dash: React.SFC<RouteComponentProps & {user: BasicUser}> = ({user}) => {
  if (!user) { return <div>User not found!</div>}
  return (
    <>
      <DashSummary uid={user.uid} displayName={user.displayName}/>
      <DashNav/>
      <React.Suspense fallback={<Loading/>}>
        <Switch>
          <Route path='/dash/history' render={(props) => <History {...props} uid={user.uid}/>}/>
          <Route path='/dash/insights/:period' render={(props) => <Insights {...props} uid={user.uid}/>}/>
          <Redirect from='/' exact to='/dash/insights/week'/>
          <Redirect from='/dash' exact to='/dash/insights/week'/>
          <Redirect from='/dash/insights' exact to='/dash/insights/week'/>
        </Switch>
      </React.Suspense>
    </>
  )
}

