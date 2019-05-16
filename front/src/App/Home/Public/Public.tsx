import React from 'react'
import { Route, Switch, Redirect } from 'react-router';
import { SignIn } from './SignIn'
import { TAndC } from './TAndC';
import { Privacy } from './Privacy';

export const Public: React.SFC = () =>
  <Switch>
    <Route path='/terms-and-conditions' component={TAndC}/>
    <Route path='/privacy-policy' component={Privacy}/>
    <Route path='/' exact component={SignIn}/>
    <Redirect from='/' to='/'/>
  </Switch>
