import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router';
import { TPathParams, StatPage } from '../shared';
import { useInsightsStats } from '../../../../../types';
import { suspensefulHook } from '../../../../../lib/suspensefulHook';
import { Overview } from './Overview';
import { Artists } from './Artists';
import { Genres } from './Genres';

export const Main: React.SFC<RouteComponentProps & { uid: string, pathParams: TPathParams }> =
({uid, history, match: {path}, pathParams}) => {
  const { insightsStats: stats } = suspensefulHook(useInsightsStats({variables: { uid }, suspend: true, pollInterval: 10000}))
  console.log('TCL: stats', stats)
  
  return <StatPage {...{stats, history, path, pathParams}}>
    <Switch>
      <Route path={`${path}/artists`} render={props => <Artists {...{uid, pathParams, ...props}}/>}/>
      <Route path={`${path}/genres`} render={props => <Genres {...{uid, pathParams, ...props}}/>}/>
      <Route path={path} render={props => <Overview {...{uid, pathParams, ...props}}/>}/>
    </Switch>
  </StatPage>
}
