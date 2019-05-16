import React from 'react';
import { RouteComponentProps, Switch, Route, Redirect } from 'react-router';
import { Main } from './Main/Main';
import { Artist } from './Artist';
import { TPathParams } from './shared';
import { Genre } from './Genre';

export const Insights: React.SFC<RouteComponentProps<TPathParams> & {uid: string}> =
({uid, history: { location: { pathname }}, match: { path, params }}) => {
  const focus = pathname.split('/').slice(5,99).join('/')
  const pathParams = {focus, ...params}
  return (
    <Switch>
      <Route path={`${path}/artists/:artistId`} render={props => <Artist {...{uid, pathParams, ...props}}/>}/>
      <Route path={`${path}/genres/:genre`} render={props => <Genre {...{uid, pathParams, ...props}}/>}/>
      <Route path={path} render={props => <Main {...{uid, pathParams, ...props}}/>}/>
    </Switch>
  )
}