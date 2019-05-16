import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router';
import { TPathParams, StatPage } from '../shared';
import { useInsightsStats, InsightsStatsInsightsStats, InsightsDashInsightsDash } from '../../../../../types';
import { Overview } from './Overview';
import { Artists } from './Artists';
import { Genres } from './Genres';


export const Main: React.SFC<RouteComponentProps & { uid: string, pathParams: TPathParams }> =
({uid, history, match: {path}, pathParams}) => {
  const {data} = useInsightsStats({variables: { uid }, suspend: true})
  if (!data || !data.insightsStats) { throw new Error('couldnt get insightsStats') } // due to suspense this should never happen, but i want to type-safe the thing
  const stats = data.insightsStats
  // const focusedStats = data.insightsStats[pathParams.timeScope][pathParams.perspective]
  return <StatPage {...{stats, history, path, pathParams}}>
    <Switch>
      <Route path={`${path}/artists`} render={props => <Artists {...{uid, pathParams, ...props}}/>}/>
      <Route path={`${path}/genres`} render={props => <Genres {...{uid, pathParams, ...props}}/>}/>
      <Route path={path} render={props => <Overview {...{uid, pathParams, ...props}}/>}/>
    </Switch>

  </StatPage>
}
