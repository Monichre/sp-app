import React from 'react';
import { RouteComponentProps } from 'react-router';
import { TPathParams } from './shared';
import { StatPage } from './shared';
import { InsightsBackLink } from './shared/InsightsBackLink';
import { useInsightsGenreStats } from '../../../../types';
import { TimeseriesChart } from './shared/TimeseriesChart';
import { suspensefulHook } from '../../../../lib/suspensefulHook';

export const Genre: React.SFC<RouteComponentProps<{genre: string}> & { uid: string, pathParams: TPathParams }> =
({uid, history, match: {path, params: { genre }}, pathParams}) => {
  const { insightsGenreStats: stats} = suspensefulHook(useInsightsGenreStats({variables: { uid, genre }, suspend: true}))
  const { [pathParams.timeScope]: { timeseries: timeSeries }} = stats
  return <StatPage {...{stats, history, path, pathParams}}>
    <h1><InsightsBackLink/>{genre}</h1>
    <TimeseriesChart {...{timeSeries}}/>
  </StatPage>
}
