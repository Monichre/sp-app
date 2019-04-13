import React from 'react';
import { LayoutAppBar } from '../LayoutAppBar';
import { useUserChange, useUser } from '../../comp/FirebaseContext';
import { Route, Switch, Redirect } from 'react-router';
import { Loading } from '../../comp/Loading';
import { Artist } from './Artist/Artist';
import { Dash } from './Dash';

export const Authed: React.SFC = () => {
  useUserChange(user => !user && window.location.replace('/'))
  const { user, isLoading } = useUser()
  if (isLoading) { return <Loading/> }
  if (!user) { return <div>User not found!</div>}
  return (
    <LayoutAppBar>
      <React.Suspense fallback={<Loading/>}>
        <Switch>
          <Route path='/dash' render={(props) => <Dash {...props} user={user}/>}/>
          <Route path='/artist/:id' render={(props) => <Artist {...props} user={user}/>}/>
          <Redirect from='/' exact to='/dash'/>
        </Switch>
      </React.Suspense>
    </LayoutAppBar>
  )
}

