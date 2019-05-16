import React from 'react';
import { RouteComponentProps } from 'react-router';
import { TPathParams } from './shared';
import { StatPage } from './shared';
import { InsightsBackLink } from './shared/InsightsBackLink';
import { useInsightsStats, useInsightsGenreStats } from '../../../../types';
import { TimeseriesChart } from './shared/TimeseriesChart';

export const Genre: React.SFC<RouteComponentProps<{genre: string}> & { uid: string, pathParams: TPathParams }> =
({uid, history, match: {path, params: { genre }}, pathParams}) => {
  const {data} = useInsightsGenreStats({variables: { uid, genre }, suspend: true})
  if (!data || !data.insightsGenreStats) { throw new Error('couldnt get insightsStats') } // due to suspense this should never happen, but i want to type-safe the thing
  const stats = data.insightsGenreStats
  const timeseries = stats[pathParams.timeScope].timeseries

  // const {data} = useInsightsStats({variables: { uid }, suspend: true})
  // if (!data || !data.insightsStats) { throw new Error('couldnt get insightsStats') } // due to suspense this should never happen, but i want to type-safe the thing
  // const stats = data.insightsStats
  return <StatPage {...{stats, history, path, pathParams}}>
    <h1><InsightsBackLink/>{genre}</h1>
    <TimeseriesChart timeseries={timeseries}/>
  </StatPage>
}
